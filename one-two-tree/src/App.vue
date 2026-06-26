<template>
  <div id="app" :dir="dir">
    <!-- Setup -->
    <div v-if="state.phase === 'setup'" class="setup">
      <h1 class="title">🌳 One-Two-Tree</h1>
      <p class="subtitle">{{ t('subtitle') }}</p>

      <div class="form">
        <label>{{ t('numPlayers') }}</label>
        <div class="player-count">
          <button
            v-for="n in [3, 4, 5]"
            :key="n"
            :class="{ active: playerCount === n }"
            @click="setPlayerCount(n)"
          >{{ n }}</button>
        </div>

        <div v-for="i in playerCount" :key="i" class="name-input">
          <div class="name-row">
            <div class="name-col">
              <label>{{ t('playerNameLabel', i) }}</label>
              <input v-model="names[i - 1]" :placeholder="`Player ${i}`" :disabled="i > 1 && bots[i - 1]" />
            </div>
            <div v-if="i > 1" class="bot-toggle">
              <button
                :class="{ active: !bots[i - 1] }"
                @click="bots[i - 1] = false"
              >{{ t('human') }}</button>
              <button
                :class="{ active: bots[i - 1] }"
                @click="bots[i - 1] = true"
              >{{ t('bot') }}</button>
            </div>
          </div>
        </div>

        <button class="btn-start" @click="start">{{ t('startGame') }}</button>
      </div>
    </div>

    <!-- Bidding phase -->
    <BiddingPhase v-else-if="state.phase === 'bidding'" />

    <!-- Game -->
    <GameBoard v-else-if="state.phase === 'playing' || state.phase === 'trick-resolved' || state.phase === 'replacing-bid'" />

    <!-- Scores -->
    <ScoreBoard
      v-else-if="state.phase === 'game-over'"
      :scores="state.scores"
      @playAgain="resetGame"
    />

    <!-- Fixed controls — always visible -->
    <div class="fixed-controls">
      <button class="btn-ctrl" @click="showRules = true">{{ t('rules') }}</button>
      <button class="btn-ctrl btn-lang" @click="toggleLang">{{ lang === 'en' ? 'עב' : 'EN' }}</button>
    </div>
    <RulesModal v-if="showRules" @close="showRules = false" />

    <footer class="credits">
      © 2026 Almog Shemesh &nbsp;·&nbsp; Game Design &amp; Concept &nbsp;·&nbsp; All rights reserved
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import GameBoard from './components/GameBoard.vue'
import BiddingPhase from './components/BiddingPhase.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import RulesModal from './components/RulesModal.vue'
import { useGameState } from './composables/useGameState.js'
import { useBotAI } from './composables/useBotAI.js'
import { useLang } from './composables/useLang.js'

const { state, startGame, resetGame } = useGameState()
useBotAI()

const { lang, t, dir, toggleLang } = useLang()
watch(lang, v => {
  document.documentElement.setAttribute('dir', v === 'he' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', v)
}, { immediate: true })

const playerCount = ref(3)
const names = ref(['You', 'Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'])
const bots = ref([false, true, true, true, true])
const showRules = ref(false)

function setPlayerCount(n) {
  playerCount.value = n
}

function start() {
  const players = names.value.slice(0, playerCount.value).map((n, i) => ({
    name: n.trim() || (i === 0 ? 'You' : `Bot ${i}`),
    isBot: i === 0 ? false : bots.value[i],
  }))
  startGame(players)
}
</script>

<style scoped>
#app {
  padding: 12px;
}
.setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  color: #e8f5e9;
}
.title {
  font-size: 3rem;
  margin: 0;
  font-weight: 900;
}
.subtitle {
  color: rgba(255,255,255,0.5);
  margin: 0 0 16px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(0,0,0,0.25);
  padding: 32px;
  border-radius: 16px;
}
.form label {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-bottom: 4px;
}
.player-count {
  display: flex;
  gap: 8px;
}
.player-count button {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.2);
  background: transparent;
  color: #e8f5e9;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}
.player-count button.active {
  background: #38a169;
  border-color: #38a169;
}
.name-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.name-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.name-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.bot-toggle {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}
.bot-toggle button {
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.45);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.bot-toggle button.active {
  background: #38a169;
  color: white;
}
.name-input input {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e8f5e9;
  font-size: 1rem;
  outline: none;
  width: 100%;
}
.name-input input:focus {
  border-color: #38a169;
}
.btn-start {
  margin-top: 8px;
  background: #38a169;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-start:hover {
  background: #2f855a;
}
.fixed-controls {
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 6px;
  z-index: 50;
}
.btn-ctrl {
  background: rgba(0,0,0,0.35);
  color: #e8f5e9;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-ctrl:hover {
  background: rgba(255,255,255,0.12);
}
.credits {
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.25);
  pointer-events: none;
  letter-spacing: 0.03em;
}

@media screen and (max-width: 425px) {
  .title {
    font-size: 2rem;
  }
}
</style>
