<template>
    <div class="game-board">
        <div class="header">
            <div class="turn-info">
                {{ isBotTurn ? t('botThinking', currentPlayer().name) : t('yourTurn', currentPlayer().name) }}
            </div>
            <div class="tiles-left">
                {{ t('tilesLeft', state.market.filter((t) => t).length + state.drawPile.length) }}
            </div>
        </div>

        <div class="players-panel">
            <PlayerBoard
                v-for="(p, i) in state.players"
                :key="p.name + i"
                :player="p"
                :is-active="i === state.currentPlayerIndex"
            />
        </div>

        <div class="market">
            <div class="market-label">{{ t('marketLabel') }}</div>
            <div class="market-row">
                <div v-for="(tile, idx) in state.market" :key="idx" class="market-slot">
                    <div class="position-label">{{ t('positionLabel', idx + 1) }}</div>
                    <TileComponent
                        v-if="tile"
                        :tile="tile"
                        interactive
                        :can-photo="!isBotTurn && canTakePhoto(tile, currentPlayer())"
                        :can-upgrade="!isBotTurn && canBuyUpgrade(currentPlayer(), idx)"
                        :upgrade-cost="positionCost(idx)"
                        @take-photo="takePhoto(idx)"
                        @buy-upgrade="(track) => buyUpgrade(idx, track)"
                    />
                    <div v-else class="empty-slot">{{ t('emptySlot') }}</div>
                    <button
                        class="btn-collect"
                        :disabled="isBotTurn || !canCollectTime(idx)"
                        @click="collectTime(idx)"
                    >
                        {{ t('collectTimeBtn', state.marketTokens[idx]) }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerBoard from './PlayerBoard.vue'
import TileComponent from './TileComponent.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const {
    state,
    currentPlayer,
    positionCost,
    canTakePhoto,
    canBuyUpgrade,
    canCollectTime,
    takePhoto,
    buyUpgrade,
    collectTime,
} = useGameState()
const { t } = useLang()

const isBotTurn = computed(() => currentPlayer()?.isBot === true)
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

.turn-info {
    font-size: 1.1rem;
    font-weight: 700;
    color: $amber;
}

.tiles-left {
    font-size: 0.85rem;
    color: $text-dim;
}

.players-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 8px;
    width: 100%;
    max-width: 900px;
}

.market {
    width: 100%;
    max-width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
}

.market-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
}

.market-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.market-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.position-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $text-dim;
}

.empty-slot {
    width: 150px;
    height: 180px;
    border: 2px dashed $border;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-dim;
    font-size: 0.75rem;
}

.btn-collect {
    width: 100%;
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
}
</style>
