import 'dotenv/config'
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import xml2js from 'xml2js'
import cors from 'cors'

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(cors())

const client = new Anthropic()


function buildSystemPrompt(games) {
  const gameList = games.map(g =>
    `- ${g.name} (${g.year}) | Players: ${g.minPlayers}–${g.maxPlayers} | Playtime: ${g.minPlaytime}–${g.maxPlaytime} min | BGG Rating: ${g.rating} | Times played: ${g.numPlays}`
  ).join('\n')

  return `You are a board game recommendation assistant. The user owns the following games from their BoardGameGeek collection:

${gameList}

Help the user decide what to play tonight. Ask clarifying questions about:
- Number of players available
- Preferred play duration
- Mood or theme preference (strategy, cooperative, party, etc.)
- Complexity preference (light, medium, heavy)
- Any games they feel like playing or avoiding

Only recommend games from their collection above. Be conversational, friendly, and concise. When you have enough info, give a top 2–3 recommendations with brief reasons why each fits.`
}

// In-memory sessions: sessionId -> { games, messages }
const sessions = new Map()


async function parseGames(xml) {
  // Sanitize bare & that aren't part of valid XML entities (e.g. game names with & in them)
  const cleanXml = xml.replace(/&(?!(?:amp|lt|gt|apos|quot|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')

  const parsed = await xml2js.parseStringPromise(cleanXml, { explicitArray: false })

  // BGG v2 API returns a "please wait" message on first request (202 Accepted)
  if (parsed.message) {
    throw new Error('BGG is still processing your collection — refresh the BGG link, wait a few seconds, then copy and paste the XML again.')
  }

  const root = parsed.items || parsed.ITEMS
  if (!root) return []
  const items = root.item || root.ITEM
  if (!items) return []
  const list = Array.isArray(items) ? items : [items]
  console.log(`Parsed ${list.length} games from BGG XML`)
  return list.map(item => {
    const name = item.name?._ || (typeof item.name === 'string' ? item.name : null)
    const stats = item.stats || {}
    const sa = stats.$ || {}
    const avg = stats.rating?.average?.$?.value
    return {
      name: name || 'Unknown',
      year: item.yearpublished?._ || item.yearpublished || '?',
      minPlayers: sa.minplayers || '?',
      maxPlayers: sa.maxplayers || '?',
      minPlaytime: sa.minplaytime || '?',
      maxPlaytime: sa.maxplaytime || '?',
      rating: avg && avg !== 'N/A' ? parseFloat(avg).toFixed(1) : '?',
      numPlays: item.numplays || '0',
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

app.post('/api/collection', async (req, res) => {
  const { username, xml: rawXml } = req.body || {}
  if (!username || !rawXml) return res.status(400).json({ error: 'username and xml required' })

  try {
    // Strip browser-prepended text — only keep from the first '<' onward
    const xmlStart = rawXml.indexOf('<')
    const xml = xmlStart > 0 ? rawXml.slice(xmlStart) : rawXml

    if (xml.includes('<errors>') || xml.includes('<error>')) {
      const msg = xml.match(/<message>([^<]*)<\/message>/)?.[1] || 'BGG returned an error'
      return res.status(400).json({ error: msg })
    }

    const games = await parseGames(xml)
    if (!games.length) return res.status(404).json({ error: 'No owned games found — make sure you copied the full XML and that your BGG collection is set to public' })

    const sessionId = `${username}-${Date.now()}`
    sessions.set(sessionId, { games, messages: [] })

    res.json({ sessionId, gameCount: games.length })
  } catch (err) {
    console.error('Collection error:', err.message)
    res.status(500).json({ error: err.message || 'Failed to parse collection' })
  }
})

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body
  if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' })

  const session = sessions.get(sessionId)
  if (!session) return res.status(404).json({ error: 'Session not found' })

  session.messages.push({ role: 'user', content: message })

  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(session.games),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: session.messages,
    })

    const response = await stream.finalMessage()
    const assistantText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    session.messages.push({ role: 'assistant', content: assistantText })

    res.json({ reply: assistantText })
  } catch (err) {
    console.error('Claude error:', err.message)
    res.status(500).json({ error: 'Failed to get response from Claude' })
  }
})

app.listen(3001, () => console.log('Backend running on http://localhost:3001'))
