<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ t('roundLabel', state.round, state.totalRounds) }}</div>
            <div class="deck-info">{{ t('deckLabel', state.deck.length) }}</div>
        </div>

        <PlayersOverview />

        <DealingPanel v-if="state.phase === 'dealing'" />
        <PickingPanel v-else-if="state.phase === 'picking' || state.phase === 'dealer-final'" />
    </div>
</template>

<script setup>
import PlayersOverview from './PlayersOverview.vue'
import DealingPanel from './DealingPanel.vue'
import PickingPanel from './PickingPanel.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state } = useGameState()
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
    font-size: 0.85rem;
    color: $text-dim;
}

.round-info {
    font-weight: 700;
    color: $gold;
    font-size: 1rem;
}
</style>
