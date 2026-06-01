<script setup>
import { computed, inject } from 'vue'
import DiceArea from './DiceArea.vue'
import FruitSelector from './FruitSelector.vue'
import PlayerScores from './PlayerScores.vue'

const game = inject('game')

const canStop = computed(() =>
  game.state.rolled && (game.state.selectedFruits.length > 0 || game.mustStop.value)
)
const canContinue = computed(() =>
  game.state.rolled &&
  game.state.selectedFruits.length > 0 &&
  !game.mustStop.value &&
  game.nonSelectedDiceCount.value > 0
)
</script>

<template>
  <div class="board">
    <!-- Header -->
    <div class="header">
      <div class="round-info">
        <span class="round-label">Round</span>
        <span class="round-num">{{ game.state.round }}</span>
        <span class="round-total">/ 6</span>
      </div>
      <div class="player-info">
        <span class="turn-label">Active Player</span>
        <span class="player-name">{{ game.activePlayer.value?.name }}</span>
      </div>
      <div class="dice-info">
        <span class="turn-label">Dice in Play</span>
        <span class="dice-num">{{ game.state.rolled ? game.state.dice.length : 6 }}</span>
      </div>
    </div>

    <!-- Main layout: dice+actions | scores -->
    <div class="main-layout">
      <div class="left-col">
        <!-- Dice -->
        <div class="panel dice-panel">
          <div class="panel-title">Dice Roll</div>
          <DiceArea />
        </div>

        <!-- Fruit selection (only after rolling) -->
        <div class="panel" v-if="game.state.rolled">
          <FruitSelector />
        </div>

        <!-- Action buttons -->
        <div class="actions">
          <button
            v-if="!game.state.rolled"
            class="btn-roll"
            @click="game.roll()"
          >
            🎲 Roll Dice
          </button>

          <template v-else>
            <button
              class="btn-stop"
              :disabled="!canStop"
              @click="game.stop()"
            >
              {{ game.mustStop.value ? '↩ Pass Turn' : '⏹ Stop &amp; Keep' }}
            </button>
            <button
              class="btn-continue"
              :disabled="!canContinue"
              @click="game.continueNext()"
            >
              Continue →
            </button>
          </template>
        </div>

        <div class="must-select-hint" v-if="game.state.rolled && game.state.selectedFruits.length === 0 && !game.mustStop.value">
          ↑ Select at least one fruit type before stopping or continuing
        </div>
      </div>

      <div class="right-col">
        <PlayerScores />
      </div>
    </div>

    <!-- Log -->
    <div class="log-section" v-if="game.state.log.length">
      <div class="log-title">Game Log</div>
      <div class="log-list">
        <div v-for="(entry, i) in game.state.log.slice(0, 8)" :key="i" class="log-entry" :class="{ fresh: i === 0 }">
          {{ entry }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.round-info, .player-info, .dice-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 20px;
  flex: 1;
  border-right: 1px solid var(--border);
}
.dice-info { border-right: none; }

.round-label, .turn-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
  margin-bottom: 4px;
}

.round-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
}
.round-total { font-size: 0.9rem; color: var(--dim); }

.player-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dice-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--purple);
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
  align-items: start;
}

@media (max-width: 640px) {
  .main-layout { grid-template-columns: 1fr; }
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.panel-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
  margin-bottom: 14px;
}

.dice-panel { min-height: 120px; }

.actions {
  display: flex;
  gap: 10px;
}

.btn-roll {
  flex: 1;
  background: linear-gradient(135deg, #2244cc, #4466ff);
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 14px;
  border-radius: 12px;
  letter-spacing: 0.3px;
}

.btn-stop {
  flex: 1;
  background: linear-gradient(135deg, #1a5533, #228855);
  color: white;
  font-weight: 700;
  padding: 12px 16px;
  border-radius: 12px;
}

.btn-continue {
  flex: 1;
  background: linear-gradient(135deg, #552288, #8833cc);
  color: white;
  font-weight: 700;
  padding: 12px 16px;
  border-radius: 12px;
}

.must-select-hint {
  font-size: 0.82rem;
  color: var(--dim);
  text-align: center;
  padding: 4px 0;
}

.right-col { position: sticky; top: 16px; }

.log-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.log-title {
  padding: 10px 14px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.log-list {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-entry {
  font-size: 0.82rem;
  color: var(--dim);
  padding: 4px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
}
.log-entry:last-child { border-bottom: none; }
.log-entry.fresh { color: var(--text); }
</style>
