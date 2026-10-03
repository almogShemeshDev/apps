<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ roundText }}</div>
            <div class="turn-info">{{ t('yourTurn', activePlayer.name) }}</div>
        </div>

        <OtherPlayersStrip v-if="otherPlayers.length" :players="otherPlayers" />

        <MarketPanel :market="state.market" :can-buy-card="canBuyCard" @buy-card="buyCard" />

        <PlayerPanel
            :player="activePlayer"
            :is-active="true"
            :selected-indices="state.selectedDiscIndices"
            :pending-choice="state.pendingChoice"
            :can-activate-option="canActivateOption"
            @activate-card="(uid, optionId) => activateOption(uid, optionId)"
            @toggle-disc="toggleDiscSelection"
            @end-turn="endTurn"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerPanel from './PlayerPanel.vue'
import MarketPanel from './MarketPanel.vue'
import OtherPlayersStrip from './OtherPlayersStrip.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { SOLO_TURN_LIMIT } from '../constants.js'

const {
    state,
    activePlayer,
    isSolo,
    toggleDiscSelection,
    canActivateOption,
    activateOption,
    canBuyCard,
    buyCard,
    endTurn,
} = useGameState()
const { t } = useLang()

const otherPlayers = computed(() =>
    state.players.filter((_, i) => i !== state.activePlayerIndex)
)

const roundText = computed(() =>
    isSolo.value ? t('turnLabel', state.round, SOLO_TURN_LIMIT) : t('roundLabel', state.round)
)
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
</style>
