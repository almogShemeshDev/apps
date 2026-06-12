<template>
  <div class="trick-area">
    <h3 class="trick-title">Current Trick</h3>
    <div class="plays">
      <div
        v-for="play in trick.plays"
        :key="play.playerId"
        class="play-slot"
        :class="{ winner: trick.winnerId === play.playerId }"
      >
        <span class="play-name">{{ getPlayer(play.playerId)?.name }}</span>
        <CardComponent :card="play.card" />
        <span v-if="trick.winnerId === play.playerId" class="win-label">Winner!</span>
      </div>
      <div v-if="!trick.plays.length" class="empty">Waiting for lead...</div>
    </div>
  </div>
</template>

<script setup>
import CardComponent from './CardComponent.vue'
import { useGameState } from '../composables/useGameState.js'

defineProps({
  trick: { type: Object, required: true },
})

const { getPlayer } = useGameState()
</script>

<style scoped>
.trick-area {
  background: rgba(0,0,0,0.25);
  border-radius: 16px;
  padding: 16px 24px;
  text-align: center;
  min-width: 260px;
}
.trick-title {
  color: #c6f6d5;
  margin: 0 0 12px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.plays {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}
.play-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.2s;
}
.play-slot.winner {
  background: rgba(246,224,94,0.2);
  outline: 2px solid #f6e05e;
}
.play-name {
  font-size: 0.75rem;
  color: #e8f5e9;
  font-weight: 600;
}
.win-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #f6e05e;
}
.empty {
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  padding: 20px 0;
}
</style>
