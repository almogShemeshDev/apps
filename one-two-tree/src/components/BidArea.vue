<template>
  <div class="bid-area">
    <div v-for="player in players" :key="player.id" class="bid-slot">
      <span class="bid-name">{{ player.name }}</span>
      <CardComponent v-if="player.bid" :card="player.bid" />
      <div v-else class="bid-empty">No bid</div>
      <span class="tricks-count">{{ player.tricksWon }} trick{{ player.tricksWon !== 1 ? 's' : '' }}</span>
    </div>
  </div>
</template>

<script setup>
import CardComponent from './CardComponent.vue'

defineProps({
  players: { type: Array, required: true },
})
</script>

<style scoped>
.bid-area {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 16px;
  background: rgba(0,0,0,0.15);
  border-radius: 12px;
}
.bid-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.bid-name {
  font-size: 0.75rem;
  color: #c6f6d5;
  font-weight: 600;
}
.bid-empty {
  width: 60px;
  height: 90px;
  border: 2px dashed rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
  font-size: 0.7rem;
}
.tricks-count {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
}
</style>
