<template>
    <div class="overview">
        <div
            v-for="(p, i) in state.players"
            :key="p.name"
            class="player-card"
            :class="{ turn: i === turnPlayerIndex }"
        >
            <div class="player-header">
                <span class="badge order-badge">{{ t('orderBadge', orderOf(i)) }}</span>
                <span class="name">{{ p.name }}</span>
                <span v-if="i === state.dealerIndex" class="badge dealer">{{ t('dealerBadge') }}</span>
                <span v-if="i === turnPlayerIndex" class="badge turn-badge">{{ t('turnBadge') }}</span>
            </div>
            <div class="hand-chips">
                <span
                    v-for="c in handCounts(p.hand)"
                    :key="c.color"
                    class="chip"
                    :style="{ background: COLOR_META[c.color].hex }"
                >
                    {{ COLOR_META[c.color].icon }} {{ c.count }}
                </span>
                <span v-if="!p.hand.length" class="none">—</span>
            </div>
            <div class="hand-total">{{ t('cardsLeftLabel', p.hand.length) }}</div>
            <div class="score-row">
                <span class="score-label">{{ t('scoreLabel') }}</span>
                <span class="score-value" dir="ltr">{{ playerScore(p) }}</span>
                <span v-if="p.flipPenalty" class="flip-chip">{{ t('flippedCountLabel', p.flipPenalty) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { COLOR_META, handCounts } from '../constants.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, turnPlayerIndex, turnOrder } = useGameState()
const { t } = useLang()

function orderOf(playerIndex) {
    return turnOrder.value.indexOf(playerIndex) + 1
}

function playerScore(p) {
    return -p.hand.length - (p.flipPenalty || 0)
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.overview {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
}

.player-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 10px 12px;

    &.turn {
        border-color: $gold;
        box-shadow: 0 0 0 1px $gold;
    }
}

.player-header {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.name {
    font-weight: 700;
    font-size: 0.92rem;
    color: $text;
}

.badge {
    border-radius: 6px;
    padding: 1px 7px;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge.dealer {
    background: $teal;
    color: $bg-dark;
}

.badge.turn-badge {
    background: $gold;
    color: $bg-dark;
}

.badge.order-badge {
    background: rgba(255, 255, 255, 0.08);
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 999px;
    min-width: 16px;
    text-align: center;
}

.hand-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 0.74rem;
    font-weight: 700;
    color: $bg-dark;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

.none {
    color: $text-dim;
    font-size: 0.78rem;
}

.hand-total {
    font-size: 0.72rem;
    color: $text-dim;
}

.score-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.score-label {
    font-size: 0.72rem;
    color: $text-dim;
}

.score-value {
    font-size: 0.78rem;
    font-weight: 700;
    color: $gold;
}

.flip-chip {
    font-size: 0.68rem;
    color: $pink;
    background: rgba(236, 72, 153, 0.12);
    border: 1px solid rgba(236, 72, 153, 0.4);
    border-radius: 999px;
    padding: 1px 7px;
}
</style>
