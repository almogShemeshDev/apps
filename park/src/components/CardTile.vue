<template>
    <div class="card-tile">
        <div class="card-icon">{{ def.icon }}</div>
        <div class="card-name">{{ t('cardName', cardId) }}</div>

        <div v-for="option in options" :key="option.id" class="option" :class="{ used: isExhausted(option) }">
            <div class="chips-row">
                <span v-for="(c, i) in useChips(option.use, t)" :key="'u' + i" class="chip" :title="c.title">
                    {{ c.icon }}<sup v-if="c.count > 1">{{ c.count }}</sup>
                </span>
                <span class="arrow">→</span>
                <span v-for="(c, i) in benefitChips(option.benefits, t)" :key="'b' + i" class="chip" :title="c.title">
                    {{ c.icon }}<sup v-if="c.count > 1">{{ c.count }}</sup>
                </span>
            </div>
            <div v-if="captionsFor(option.benefits, t).length" class="caption">
                {{ captionsFor(option.benefits, t).join(' · ') }}
            </div>

            <template v-if="mode === 'tableau'">
                <div v-if="(option.maxUsesPerTurn ?? 1) > 1 || options.length > 1" class="option-uses">
                    {{ t('usesLabel', usesThisTurn[option.id] ?? 0, option.maxUsesPerTurn ?? 1) }}
                </div>
                <button
                    class="card-btn"
                    :disabled="!canActivateOption(option.id)"
                    @click="$emit('activate', option.id)"
                >
                    {{ isExhausted(option) ? '✓' : t('activate') }}
                </button>
            </template>
        </div>

        <template v-if="mode === 'market'">
            <div class="card-remaining">{{ remaining > 0 ? t('remainingLabel', remaining) : t('soldOut') }}</div>
            <button class="card-btn" :disabled="!canBuy" @click="$emit('buy')">
                {{ t('buy') }} <span class="chip" :title="t('goldLabel')">💰<sup v-if="def.cost > 1">{{ def.cost }}</sup></span>
            </button>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { CARD_DEFS, getCardOptions } from '../constants.js'
import { useLang } from '../composables/useLang.js'
import { useChips, benefitChips, captionsFor } from '../cardFormat.js'

const props = defineProps({
    cardId: { type: String, required: true },
    mode: { type: String, required: true }, // 'tableau' | 'market'
    usesThisTurn: { type: Object, default: () => ({}) },
    canActivateOption: { type: Function, default: () => false },
    canBuy: { type: Boolean, default: false },
    remaining: { type: Number, default: 0 },
})
defineEmits(['activate', 'buy'])

const { t } = useLang()
const def = computed(() => CARD_DEFS[props.cardId])
const options = computed(() => getCardOptions(def.value))

function isExhausted(option) {
    return (props.usesThisTurn[option.id] ?? 0) >= (option.maxUsesPerTurn ?? 1)
}
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
    padding-top: 6px;
    margin-top: 2px;
    border-top: 1px solid $border;
    width: 100%;
    transition: opacity 0.15s;

    &:first-of-type {
        border-top: none;
        padding-top: 0;
    }

    &.used {
        opacity: 0.55;
    }
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

.caption {
    font-size: 0.62rem;
    color: $text-dim;
    text-align: center;
    font-style: italic;
}

.option-uses {
    font-size: 0.65rem;
    color: $text-dim;
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

    .chip sup {
        color: $bg-dark;
    }

    &:hover:not(:disabled) {
        background: $gold-light;
    }

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
}
</style>
