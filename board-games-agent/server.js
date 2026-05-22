import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'
import xml2js from 'xml2js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const client = new Anthropic()

function extractUsername(url) {
  const match = url.match(/collection\/user\/([^?/]+)/)
  return match ? match[1] : null
}

async function fetchBGGCollection(username) {
  const apiUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&stats=1&subtype=boardgame`

  let response = await axios.get(apiUrl)

  // BGG may return 202 if the request is queued — retry after delay
  if (response.status === 202) {
    await new Promise(r => setTimeout(r, 4000))
    response = await axios.get(apiUrl)
  }

  if (response.status === 202) {
    await new Promise(r => setTimeout(r, 4000))
    response = await axios.get(apiUrl)
  }

  const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false })
  const items = parsed.items?.item

  if (!items) return []

  const list = Array.isArray(items) ? items : [items]

  return list.map(item => {
    const name = item.name?._ || item.name || 'Unknown'
    const stats = item.stats || {}
    return {
      name,
      year: item.yearpublished || '?',
      minPlayers: stats['@_minplayers'] || '?',
      maxPlayers: stats['@_maxplayers'] || '?',
      minPlaytime: stats['@_minplaytime'] || '?',
      maxPlaytime: stats['@_maxplaytime'] || '?',
      rating: item.stats?.rating?.average?.['@_value']
        ? parseFloat(item.stats.rating.average['@_value']).toFixed(1)
        : '?',
      numPlays: item.numplays || '0',
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

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

app.post('/api/collection', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL required' })

  const username = extractUsername(url)
  if (!username) return res.status(400).json({ error: 'Could not extract username from URL' })

  try {
    const games = await fetchBGGCollection(username)
    if (games.length === 0) {
      return res.status(404).json({ error: `No owned games found for user "${username}"` })
    }

    const sessionId = `${username}-${Date.now()}`
    sessions.set(sessionId, { games, messages: [] })

    res.json({ sessionId, username, gameCount: games.length })
  } catch (err) {
    console.error('BGG fetch error:', err.message)
    res.status(500).json({ error: 'Failed to fetch collection from BoardGameGeek' })
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
