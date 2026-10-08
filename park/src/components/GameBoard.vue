<template>
    <div class="game-board">
        <div class="header">
            <div class="round-info">{{ roundText }}</div>
            <div class="turn-info">{{ t('yourTurn', activePlayer.name) }}</div>
        </div>

        <OtherPlayersStrip v-if="otherPlayers.length" :players="otherPlayers" />

        <div class="columns">
            <div class="player-col">
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

            <div class="market-col">
                <MarketPanel :market="state.market" :can-buy-card="safeCanBuyCard" @buy-card="buyCard" />

                <ExitMarketPanel
                    :exit-market="state.exitMarket"
                    :can-buy-exit-card="safeCanBuyExitCard"
                    @buy-exit-card="buyExitCard"
                />
            </div>

            <GameLog class="log-col" />
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
    height: 100vh;
    max-height: calc(100vh - 100px);
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

.columns {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
}

.player-col {
    flex: 1;
    min-width: 0;
}

.market-col {
    flex: 1.6;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.log-col {
    width: 320px;
    flex-shrink: 0;
}

@media screen and (max-width: 1100px) {
    .columns {
        flex-direction: column;
    }

    .market-col {
        max-height: none;
        overflow: visible;
    }

    .log-col {
        width: 100%;
        max-height: 280px;
    }
}
</style>
