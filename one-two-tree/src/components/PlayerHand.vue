<template>
  <div class="hand">
    <p class="hand-label">{{ player.name }}</p>
    <div class="hand-row">
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

      <div class="bid-box" :class="{ matching: isMatching }">
        <span class="bid-box-label" :class="{ matching: isMatching }">BID</span>
        <CardComponent v-if="player.bid" :card="player.bid"
          :selectable="isActive && isBidCardLegal"
          :dimmed="isActive && !isBidCardLegal"
          @select="$emit('play', player.bid)" />
        <div v-else class="bid-empty">—</div>
        <span class="tricks-count" :class="{ matching: isMatching }">
          {{ player.tricksWon }} trick{{ player.tricksWon !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
    <span v-if="isActive" class="turn-badge">Your turn</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CardComponent from './CardComponent.vue'
import { legalCards, isBidCorrect } from '../composables/useTrickLogic.js'

const props = defineProps({
  player: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  leadSuit: { type: String, default: null },
})
defineEmits(['play'])

function isLegal(card) {
  return !!legalCards(props.player.hand, props.leadSuit, props.player.bid).find(c => c.id === card.id)
}

const isBidCardLegal = computed(() => {
  if (!props.isActive || !props.player.bid) return false
  return isLegal(props.player.bid)
})

const isMatching = computed(() =>
  props.player.bid != null && isBidCorrect(props.player.bid, props.player.tricksWon)
)
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
}
.hand-label {
  font-weight: 700;
  font-size: 0.9rem;
  color: #e8f5e9;
  margin: 0;
}
.hand-row {
  display: flex;
  align-items: center;
  gap: 12px;
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
.bid-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.2);
  min-width: 72px;
  transition: border-color 0.2s, background 0.2s;
}
.bid-box.matching {
  border-color: #f6e05e;
  background: rgba(246,224,94,0.08);
}
.bid-box-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  transition: color 0.2s;
}
.bid-box-label.matching {
  color: #f6e05e;
}
.bid-empty {
  width: 60px;
  height: 90px;
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.25);
  font-size: 1rem;
}
.tricks-count {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  transition: color 0.2s;
}
.tricks-count.matching {
  color: #f6e05e;
  font-weight: 700;
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
