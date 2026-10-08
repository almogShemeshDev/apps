<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ roundText }}</div>
            <div class="turn-info">{{ t('yourTurn', activePlayer.name) }}</div>
        </div>

        <div class="layout">
            <div class="main-column">
                <OtherPlayersStrip v-if="otherPlayers.length" :players="otherPlayers" />

                <MarketPanel :market="state.market" :can-buy-card="safeCanBuyCard" @buy-card="buyCard" />

                <ExitMarketPanel
                    :exit-market="state.exitMarket"
                    :can-buy-exit-card="safeCanBuyExitCard"
                    @buy-exit-card="buyExitCard"
                />

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

            <GameLog class="log-column" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerPanel from './PlayerPanel.vue'
import MarketPanel from './MarketPanel.vue'
import ExitMarketPanel from './ExitMarketPanel.vue'
import OtherPlayersStrip from './OtherPlayersStrip.vue'
import GameLog from './GameLog.vue'
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
    canBuyExitCard,
    buyExitCard,
    endTurn,
} = useGameState()
const { t } = useLang()

const otherPlayers = computed(() =>
    state.players.filter((_, i) => i !== state.activePlayerIndex)
)

// Block clicks from reaching the market/exit buy actions while a bot is
// taking its turn, since those buttons otherwise act on whoever is active.
function safeCanBuyCard(cardId) {
    return !activePlayer.value.isBot && canBuyCard(cardId)
}

function safeCanBuyExitCard(cardId) {
    return !activePlayer.value.isBot && canBuyExitCard(cardId)
}

const roundText = computed(() => t('roundLabel', state.round))
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

.layout {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    max-width: 1200px;
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

@media screen and (max-width: 960px) {
    .layout {
        flex-direction: column;
    }

    .log-column {
        width: 100%;
        max-height: 280px;
    }
}
</style>
