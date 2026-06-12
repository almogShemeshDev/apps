<template>
  <div class="hand">
    <p class="hand-label">{{ player.name }}</p>
    <div class="cards">
      <CardComponent
        v-for="card in player.hand"
        :key="card.id"
        :card="card"
        :selectable="isActive && isLegal(card)"
        :dimmed="isActive && !isLegal(card)"
        @select="$emit('play', card)"
      />
      <span v-if="!player.hand.length" class="empty">No cards</span>
    </div>
    <span v-if="isActive" class="turn-badge">Your turn</span>
  </div>
</template>

<script setup>
import CardComponent from './CardComponent.vue'
import { legalCards } from '../composables/useTrickLogic.js'

const props = defineProps({
  player: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  leadSuit: { type: String, default: null },
})
defineEmits(['play'])

function isLegal(card) {
  return !!legalCards(props.player.hand, props.leadSuit).find(c => c.id === card.id)
}
</script>

<style scoped>
.hand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0,0,0,0.15);
  min-width: 120px;
}
.hand-label {
  font-weight: 700;
  font-size: 0.9rem;
  color: #e8f5e9;
  margin: 0;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}
.empty {
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
}
.turn-badge {
  background: #f6e05e;
  color: #744210;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}
</style>
