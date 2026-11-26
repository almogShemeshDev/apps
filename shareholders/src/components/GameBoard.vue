<template>
    <div class="game-board">
        <div class="header">
            <div class="header-left">
                <div class="round-info">{{ t('roundLabel', state.round) }}</div>
                <div class="deck-info">{{ t('deckLabel', state.deck.length) }}</div>
            </div>
            <div class="turn-info">
                {{ activePlayer.isBot ? t('botThinking', activePlayer.name) : t('yourTurn', activePlayer.name) }}
            </div>
        </div>

        <TrainPool :pool="state.pool" />

        <DraftRow :row="state.row" :clickable="!activePlayer.isBot" @pick="pickCard" />

        <SharesTable
            :players="state.players"
            :pool="state.pool"
            :active-index="state.activePlayerIndex"
            :starting-index="state.startingPlayerIndex"
            :show-score="showScore"
            @toggle-score="showScore = !showScore"
        />

        <GameLog />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TrainPool from './TrainPool.vue'
import DraftRow from './DraftRow.vue'
import SharesTable from './SharesTable.vue'
import GameLog from './GameLog.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, activePlayer, pickCard } = useGameState()
const { t } = useLang()

const showScore = ref(false)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    max-width: 960px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.round-info,
.deck-info {
    font-size: 0.85rem;
    color: $text-dim;
}

.turn-info {
    font-size: 1.1rem;
    font-weight: 700;
    color: $gold;
}
</style>
