<template>
  <button
    class="card"
    :class="[`suit-${card.suit}`, { selectable, dimmed, selected }]"
    :disabled="!selectable"
    @click="selectable && $emit('select', card)"
  >
    <span class="card-value">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  dimmed: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])

const label = computed(() => {
  if (props.card.value === 'tree') return '🌳'
  return props.card.value
})
</script>

<style scoped>
.card {
  width: 60px;
  height: 90px;
  border-radius: 8px;
  border: 2px solid rgba(0,0,0,0.2);
  font-size: 1.6rem;
  font-weight: bold;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  background: white;
  color: #222;
  flex-shrink: 0;
}
.card.selectable {
  cursor: pointer;
}
.card.selectable:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}
.card.selected {
  transform: translateY(-12px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  outline: 3px solid #fff;
}
.card.dimmed {
  opacity: 0.4;
}

.suit-red    { background: #ffeaea; border-color: #e53e3e; color: #c53030; }
.suit-blue   { background: #ebf4ff; border-color: #3182ce; color: #2b6cb0; }
.suit-green  { background: #f0fff4; border-color: #38a169; color: #276749; }
.suit-yellow { background: #fffff0; border-color: #d69e2e; color: #b7791f; }
</style>
