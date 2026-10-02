<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ t('roundLabel', state.round) }}</div>
            <div class="turn-info">{{ t('yourTurn', activePlayer.name) }}</div>
        </div>

        <div class="players-panel">
            <PlayerPanel
                v-for="(p, i) in state.players"
                :key="p.name + i"
                :player="p"
                :is-active="i === state.activePlayerIndex"
                :selected-indices="state.selectedDiscIndices"
                :can-activate-card="canActivateCard"
                :max-uses-per-turn="maxUsesPerTurn"
                @activate-card="activateCard"
                @toggle-disc="toggleDiscSelection"
            />
        </div>

        <MarketPanel :market="state.market" :can-buy-card="canBuyCard" @buy-card="buyCard" />

        <button class="btn-end-turn" @click="endTurn">{{ t('endTurn') }}</button>
    </div>
</template>

<script setup>
import PlayerPanel from './PlayerPanel.vue'
import MarketPanel from './MarketPanel.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const {
    state,
    activePlayer,
    maxUsesPerTurn,
    toggleDiscSelection,
    canActivateCard,
    activateCard,
    canBuyCard,
    buyCard,
    endTurn,
} = useGameState()
const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    min-height: 100vh;
    background: $bg-dark;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 900px;
}

.round-info {
    font-size: 0.85rem;
    color: $text-dim;
}

.turn-info {
    font-size: 1.1rem;
    font-weight: 700;
    color: $gold;
}

.players-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    max-width: 900px;
}

.btn-end-turn {
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
