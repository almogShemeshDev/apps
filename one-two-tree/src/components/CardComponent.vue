<template>
    <div
        class="card"
        :class="[`suit-${card.suit}`, { selectable, selected, 'face-down': faceDown, disabled }]"
        @click="selectable && !faceDown && $emit('select', card)"
    >
        <template v-if="!faceDown">
            <span class="value">{{ displayValue }}</span>
            <span class="suit-icon">{{ suitIcon }}</span>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    card: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    faceDown: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
})

defineEmits(['select'])

const displayValue = computed(() => {
    if (props.card.value === 'tree') return '🌳'
    return props.card.value
})

const suitIcon = computed(() => {
    const icons = { red: '♥', blue: '♦', green: '♣', yellow: '★' }
    return icons[props.card.suit] ?? ''
})
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.card {
    width: 64px;
    height: 90px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: 700;
    font-size: 1.1rem;
    background: rgba(255, 255, 255, 0.06);
    color: $text;
    transition:
        transform 0.1s,
        box-shadow 0.1s,
        border-color 0.1s;
    user-select: none;

    &.suit-red {
        border-color: #fc8181;
        .suit-icon {
            color: #fc8181;
        }
    }
    &.suit-blue {
        border-color: #63b3ed;
        .suit-icon {
            color: #63b3ed;
        }
    }
    &.suit-green {
        border-color: $green-light;
        .suit-icon {
            color: $green-light;
        }
    }
    &.suit-yellow {
        border-color: $gold;
        .suit-icon {
            color: $gold;
        }
    }
    &.selectable:not(.face-down) {
        cursor: pointer;
        &:hover {
            transform: translateY(-6px);
        }
    }
    &.selected {
        transform: translateY(-10px);
        border-color: $gold;
        box-shadow: 0 0 12px rgba(246, 224, 94, 0.4);
    }
    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    &.face-down {
        background: repeating-linear-gradient(
            45deg,
            #1a4731,
            #1a4731 4px,
            #163d2a 4px,
            #163d2a 8px
        );
        border-color: #0d2b1d;
        cursor: default;
    }
}
.value {
    font-size: 1.3rem;
    line-height: 1;
}
.suit-icon {
    font-size: 0.85rem;
    line-height: 1;
}
</style>
