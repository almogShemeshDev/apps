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
                :pending-choice="state.pendingChoice"
                :can-activate-option="canActivateOption"
                @activate-card="(uid, optionId) => activateOption(uid, optionId)"
                @toggle-disc="toggleDiscSelection"
                @end-turn="endTurn"
            />
        </div>

        <MarketPanel :market="state.market" :can-buy-card="canBuyCard" @buy-card="buyCard" />
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
    toggleDiscSelection,
    canActivateOption,
    activateOption,
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
</style>
