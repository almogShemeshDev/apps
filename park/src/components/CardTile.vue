<template>
    <div class="card-tile" :class="{ used: mode === 'tableau' && usesThisTurn >= maxUses }">
        <div class="card-icon">{{ def.icon }}</div>
        <div class="card-name">{{ t('cardName', cardId) }}</div>
        <div class="card-line">{{ t('useLabel', def.use.amount, def.use.disc) }}</div>
        <div class="card-line">{{ t('benefitLabel', def.benefit.type, def.benefit.amount) }}</div>

        <template v-if="mode === 'tableau'">
            <div v-if="maxUses > 1" class="card-remaining">{{ t('usesLabel', usesThisTurn, maxUses) }}</div>
            <button class="card-btn" :disabled="!canAct" @click="$emit('activate')">
                {{ usesThisTurn >= maxUses ? '✓' : t('activate') }}
            </button>
        </template>

        <template v-else>
            <div class="card-remaining">{{ remaining > 0 ? t('remainingLabel', remaining) : t('soldOut') }}</div>
            <button class="card-btn" :disabled="!canAct" @click="$emit('buy')">
                {{ t('buy') }} · {{ t('costLabel', def.cost) }}
            </button>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { CARD_DEFS } from '../constants.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    cardId: { type: String, required: true },
    mode: { type: String, required: true }, // 'tableau' | 'market'
    canAct: { type: Boolean, default: false },
    usesThisTurn: { type: Number, default: 0 },
    maxUses: { type: Number, default: 1 },
    remaining: { type: Number, default: 0 },
})
defineEmits(['activate', 'buy'])

const { t } = useLang()
const def = computed(() => CARD_DEFS[props.cardId])
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
    min-width: 120px;
    transition: opacity 0.15s;

    &.used {
        opacity: 0.55;
    }
}

.card-icon {
    font-size: 1.8rem;
}

.card-name {
    font-weight: 700;
    color: $gold;
    font-size: 0.9rem;
}

.card-line {
    font-size: 0.7rem;
    color: $text-dim;
    text-align: center;
}

.card-remaining {
    font-size: 0.68rem;
    color: $text-dim;
    margin-top: 2px;
}

.card-btn {
    margin-top: 6px;
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
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
