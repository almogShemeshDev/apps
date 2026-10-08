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
import { CARD_DEFS, EXIT_CARD_DEFS } from '../constants.js'
import { benefitChips } from '../cardFormat.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state } = useGameState()
const { t } = useLang()

const entriesEl = ref(null)

watch(
    () => state.log.length,
    () => {
        nextTick(() => {
            if (entriesEl.value) entriesEl.value.scrollTop = entriesEl.value.scrollHeight
        })
    }
)

function chipsText(benefits) {
    return benefitChips(benefits, t)
        .map((c) => `${c.icon}${c.count}`)
        .join(' ')
}

function formatEntry(entry) {
    switch (entry.type) {
        case 'turn-start':
            return t('logTurnStart', entry.round, entry.playerName)
        case 'activate':
            return t(
                'logActivate',
                entry.playerName,
                CARD_DEFS[entry.cardId]?.icon ?? '',
                t('cardName', entry.cardId),
                chipsText(entry.benefits)
            )
        case 'buy-card':
            return t(
                'logBuyCard',
                entry.playerName,
                CARD_DEFS[entry.cardId]?.icon ?? '',
                t('cardName', entry.cardId),
                entry.cost
            )
        case 'buy-exit-card':
            return t(
                'logBuyExitCard',
                entry.playerName,
                EXIT_CARD_DEFS[entry.cardId]?.icon ?? '',
                t('exitCardName', entry.cardId),
                entry.pinkCost,
                entry.vp
            )
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
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
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
