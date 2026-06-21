<template>
  <div id="app">
     <!-- Mansa's Tribute -->
    <GameSetup v-if="state.phase === 'setup'" @start="startGame" />
    <GameBoard
      v-else-if="state.phase === 'playing' || state.phase === 'trick-result' || state.phase === 'dice-picking'"
    />
    <ScoreBoard
      v-else-if="state.phase === 'game-over'"
      :players="state.players"
      @playAgain="resetGame"
    />
  </div>
</template>

<script setup>
import GameSetup from './components/GameSetup.vue'
import GameBoard from './components/GameBoard.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import { useGameState } from './composables/useGameState.js'

const { state, startGame, resetGame } = useGameState()
</script>

<style lang="scss" scoped>
#app {
  min-height: 100vh;
}
</style>
