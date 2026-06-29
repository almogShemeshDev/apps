<template>
    <div
        class="card"
        :class="{ selectable, selected, dimmed, horizontal }"
        :style="{ '--c': suitColor }"
        @click="selectable && $emit('select')"
    >
        <span class="sym top">{{ sym }}</span>
        <span class="sym bot">{{ sym }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { SUIT_COLORS, SUIT_SYMBOLS } from '../constants.js'

const props = defineProps({
    card: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    dimmed: { type: Boolean, default: false },
    horizontal: { type: Boolean, default: false },
})
defineEmits(['select'])

const suitColor = computed(() => SUIT_COLORS[props.card.suit])
const sym = computed(() => SUIT_SYMBOLS[props.card.suit])
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.card {
    width: 52px;
    height: 78px;
    border-radius: 8px;
    background: var(--c);
    border: 2px solid rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    user-select: none;
    transition:
        transform 0.12s,
        box-shadow 0.12s,
        opacity 0.12s;
    flex-shrink: 0;

    &.selectable {
        cursor: pointer;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.5);
        }
    }

    &.selected {
        transform: translateY(-10px);
        box-shadow: 0 10px 24px rgba($gold, 0.5);
        border-color: $gold;
    }

    &.dimmed {
        opacity: 0.3;
    }

    &.horizontal {
        transform: rotate(90deg);
        margin: 13px 0;
    }
}

.sym {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 700;
    line-height: 1;
    &.bot {
        transform: rotate(180deg);
        align-self: flex-end;
    }
}
</style>
