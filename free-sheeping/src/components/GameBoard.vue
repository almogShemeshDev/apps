<template>
    <div class="game-board">
        <div class="header">
            <div class="turn-info">{{ t('turnLabel', state.turnNumber) }} — {{ turnPlayer?.name }}</div>
            <div class="deck-info">{{ t('deckLabel', state.deck.length) }}</div>
        </div>

        <div class="layout">
            <div class="main-column">
                <ShippingWindowTrack />
                <PlayersOverview />
                <ShoppingCart />

                <div v-if="turnPlayer?.isBot" class="bot-thinking">🤖 {{ turnPlayer.name }} is thinking...</div>
                <ActionBar v-else :player-index="state.turnIndex" />

                <ProbabilityPanel />
            </div>

            <GameLog class="log-column" />
        </div>
    </div>
</template>

<script setup>
import ShippingWindowTrack from './ShippingWindowTrack.vue'
import PlayersOverview from './PlayersOverview.vue'
import ShoppingCart from './ShoppingCart.vue'
import ActionBar from './ActionBar.vue'
import ProbabilityPanel from './ProbabilityPanel.vue'
import GameLog from './GameLog.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, turnPlayer } = useGameState()
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
    max-width: 1040px;
    font-size: 0.85rem;
    color: $text-dim;
}

.turn-info {
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

.bot-thinking {
    width: 100%;
    text-align: center;
    padding: 12px;
    background: $surface;
    border: 1px dashed $border;
    border-radius: 12px;
    color: $text-dim;
    font-size: 0.85rem;
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
