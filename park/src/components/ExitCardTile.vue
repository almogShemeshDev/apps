<template>
    <div class="card-tile">
        <div class="card-icon">{{ def.icon }}</div>
        <div class="card-name">{{ t('exitCardName', cardId) }}</div>

        <div class="option">
            <div class="chips-row">
                <span v-for="(c, i) in costChips" :key="'c' + i" class="chip" :title="c.title">
                    {{ c.icon }}<sup v-if="c.count > 1">{{ c.count }}</sup>
                </span>
                <span class="arrow">→</span>
                <span v-for="(c, i) in vpChips" :key="'v' + i" class="chip" :title="c.title">
                    {{ c.icon }}<sup v-if="c.count > 1">{{ c.count }}</sup>
                </span>
            </div>
        </div>

        <div class="card-remaining">{{ remaining > 0 ? t('remainingLabel', remaining) : t('soldOut') }}</div>
        <button class="card-btn" :disabled="!canBuy" @click="$emit('buy')">{{ t('buy') }}</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { EXIT_CARD_DEFS } from '../constants.js'
import { useLang } from '../composables/useLang.js'
import { useChips, benefitChips } from '../cardFormat.js'

const props = defineProps({
    cardId: { type: String, required: true },
    canBuy: { type: Boolean, default: false },
    remaining: { type: Number, default: 0 },
})
defineEmits(['buy'])

const { t } = useLang()
const def = computed(() => EXIT_CARD_DEFS[props.cardId])
const costChips = computed(() => useChips({ discs: [{ type: 'pink', amount: def.value.pinkCost }] }, t))
const vpChips = computed(() => benefitChips([{ type: 'vp', amount: def.value.vp }], t))
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.card-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 12px;
    width: 100%;
    box-sizing: border-box;
}

.card-icon {
    font-size: 1.8rem;
}

.card-name {
    font-weight: 700;
    color: $gold;
    font-size: 0.9rem;
    margin-bottom: 2px;
}

.option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    width: 100%;
}

.chips-row {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: wrap;
    justify-content: center;
}

.chip {
    display: inline-flex;
    align-items: flex-start;
    font-size: 1rem;
    line-height: 1;

    sup {
        font-size: 0.6rem;
        color: $text;
        font-weight: 700;
    }
}

.arrow {
    color: $text-dim;
    font-size: 0.8rem;
    margin: 0 2px;
}

.card-remaining {
    font-size: 0.68rem;
    color: $text-dim;
    margin-top: 4px;
}

.card-btn {
    margin-top: 4px;
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: $gold-light;
    }

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
}
</style>
