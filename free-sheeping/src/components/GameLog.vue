<template>
    <div class="game-log">
        <h3 class="log-title">{{ t('logTitle') }}</h3>
        <div ref="entriesEl" class="log-entries">
            <p v-if="!state.log.length" class="log-empty">{{ t('logEmpty') }}</p>
            <p
                v-for="entry in state.log"
                :key="entry.id"
                class="log-entry"
                :class="{ 'log-entry-turn': entry.type === 'turn-start' }"
            >
                {{ formatEntry(entry) }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { PRODUCTS_BY_ID } from '../game/products.js'
import { SPECIALS_BY_ID } from '../game/specials.js'
import { PROBLEMS_BY_ID } from '../game/problems.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state } = useGameState()
const { t, cardName } = useLang()

const entriesEl = ref(null)

watch(
    () => state.log.length,
    () => {
        nextTick(() => {
            if (entriesEl.value) entriesEl.value.scrollTop = entriesEl.value.scrollHeight
        })
    }
)

function nameFor(defId, cardType) {
    const def = cardType === 'special' ? SPECIALS_BY_ID[defId] : cardType === 'problem' ? PROBLEMS_BY_ID[defId] : PRODUCTS_BY_ID[defId]
    return def ? cardName(def) : defId
}

function formatEntry(entry) {
    switch (entry.type) {
        case 'turn-start':
            return t('logTurnStart', entry.playerName)
        case 'draw':
            return t('logDraw', entry.playerName, nameFor(entry.defId, entry.cardType), entry.price)
        case 'stop':
            return t('logStop', entry.playerName, entry.productCount, entry.total, entry.penalty)
        case 'bust':
            return t('logBust', entry.playerName, entry.points)
        case 'coupon':
            return t('logCoupon', entry.playerName)
        case 'free-return':
            return t('logFreeReturn', entry.playerName, nameFor(entry.defId, 'product'))
        case 'shipping-insurance':
            return t('logShippingInsurance', entry.playerName)
        case 'extra-pick':
            return t('logExtraPick', entry.playerName)
        case 'sneak-peek':
            return t('logSneakPeek', entry.playerName)
        case 'sneak-peek-swap':
            return t('logSneakPeekSwap', entry.playerName)
        case 'sneak-peek-keep':
            return t('logSneakPeekKeep', entry.playerName)
        case 'turn-skip':
            return t('logTurnSkip', entry.playerName)
        case 'game-over':
            return t('logGameOver')
        default:
            return ''
    }
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-log {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 14px;
    width: 100%;
    max-height: 560px;
}

.log-title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.log-entries {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    min-height: 0;
}

.log-empty {
    color: $text-dim;
    font-size: 0.82rem;
}

.log-entry {
    font-size: 0.8rem;
    color: $text;
    line-height: 1.4;
}

.log-entry-turn {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid $border;
    color: $gold;
    font-weight: 700;
}
</style>
