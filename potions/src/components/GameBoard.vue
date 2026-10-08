<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ t('roundLabel', state.round, state.totalRounds) }}</div>
            <div class="deck-info">{{ t('deckLabel', state.deck.length) }}</div>
        </div>

        <div class="layout">
            <div class="main-column">
                <PlayersOverview />

                <DealingPanel v-if="state.phase === 'dealing'" />
                <PickingPanel v-else-if="state.phase === 'picking' || state.phase === 'dealer-final'" />
            </div>

            <GameLog class="log-column" />
        </div>
    </div>
</template>

<script setup>
import PlayersOverview from './PlayersOverview.vue'
import DealingPanel from './DealingPanel.vue'
import PickingPanel from './PickingPanel.vue'
import GameLog from './GameLog.vue'
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

.layout {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    max-width: 1040px;
}

.main-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.log-column {
    width: 300px;
    flex-shrink: 0;
}

@media screen and (max-width: 860px) {
    .layout {
        flex-direction: column;
    }

    .log-column {
        width: 100%;
        max-height: 280px;
    }
}
</style>
