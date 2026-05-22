<template>
  <div class="app">
    <!-- Setup screen -->
    <div v-if="!sessionId" class="setup">
      <div class="logo">🎲</div>
      <h1>Board Game Agent</h1>
      <p class="subtitle">Paste your BoardGameGeek collection URL to get started</p>

      <div class="input-row">
        <input
          v-model="collectionUrl"
          type="text"
          placeholder="https://boardgamegeek.com/collection/user/yourname"
          :disabled="loading"
          @keydown.enter="loadCollection"
        />
        <button @click="loadCollection" :disabled="loading || !collectionUrl.trim()">
          {{ loading ? 'Loading…' : 'Load' }}
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- Chat screen -->
    <template v-else>
      <header class="chat-header">
        <span>🎲 Board Game Agent</span>
        <span class="meta">{{ gameCount }} games · {{ username }}</span>
        <button class="reset-btn" @click="reset">New session</button>
      </header>

      <div class="messages" ref="messagesEl">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="message"
          :class="msg.role"
        >
          <div class="bubble" v-html="formatMessage(msg.content)"></div>
        </div>
        <div v-if="thinking" class="message assistant">
          <div class="bubble thinking">Thinking…</div>
        </div>
      </div>

      <div class="input-area">
        <textarea
          v-model="userInput"
          placeholder="Ask me what to play…"
          rows="1"
          :disabled="thinking"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button @click="sendMessage" :disabled="thinking || !userInput.trim()">Send</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const collectionUrl = ref('')
const sessionId = ref(null)
const username = ref('')
const gameCount = ref(0)
const messages = ref([])
const userInput = ref('')
const loading = ref(false)
const thinking = ref(false)
const error = ref('')
const messagesEl = ref(null)

async function loadCollection() {
  if (!collectionUrl.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: collectionUrl.value.trim() }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to load collection')

    sessionId.value = data.sessionId
    username.value = data.username
    gameCount.value = data.gameCount

    messages.value = [{
      role: 'assistant',
      content: `I've loaded **${data.gameCount} games** from **${data.username}**'s collection. What are you in the mood for tonight? Tell me how many players you have and I'll help you pick something great!`,
    }]
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || thinking.value) return

  messages.value.push({ role: 'user', content: text })
  userInput.value = ''
  thinking.value = true
  await scrollToBottom()

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.value, message: text }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to get response')

    messages.value.push({ role: 'assistant', content: data.reply })
  } catch (err) {
    messages.value.push({ role: 'assistant', content: `Error: ${err.message}` })
  } finally {
    thinking.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

function reset() {
  sessionId.value = null
  messages.value = []
  collectionUrl.value = ''
  userInput.value = ''
  error.value = ''
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

/* Setup */
.setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  text-align: center;
}

.logo { font-size: 3rem; }

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.subtitle {
  color: #888;
  font-size: 0.95rem;
  max-width: 400px;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 560px;
}

input, textarea {
  flex: 1;
  background: #1a1a24;
  border: 1px solid #2e2e42;
  border-radius: 8px;
  color: #e8e8f0;
  padding: 0.65rem 0.9rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
}

input:focus, textarea:focus {
  border-color: #5865f2;
}

button {
  background: #5865f2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

button:hover:not(:disabled) { background: #4752c4; }
button:disabled { opacity: 0.45; cursor: not-allowed; }

.error {
  color: #f47373;
  font-size: 0.9rem;
}

/* Chat */
.chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #1e1e2e;
  font-weight: 600;
}

.meta {
  font-size: 0.8rem;
  color: #666;
  font-weight: 400;
}

.reset-btn {
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  background: #1a1a24;
  border: 1px solid #2e2e42;
}

.reset-btn:hover:not(:disabled) { background: #2e2e42; }

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0;
  scrollbar-width: thin;
  scrollbar-color: #2e2e42 transparent;
}

.message {
  display: flex;
}

.message.user { justify-content: flex-end; }

.bubble {
  max-width: 82%;
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.55;
}

.message.assistant .bubble {
  background: #1a1a2e;
  border: 1px solid #2e2e42;
  border-radius: 12px 12px 12px 4px;
}

.message.user .bubble {
  background: #5865f2;
  color: #fff;
  border-radius: 12px 12px 4px 12px;
}

.thinking {
  color: #666;
  font-style: italic;
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #1e1e2e;
}

textarea {
  resize: none;
  line-height: 1.5;
}
</style>
