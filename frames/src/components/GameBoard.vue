<template>
    <div class="game-board">
        <div class="header">
            <div class="turn-info">{{ t('yourTurn', currentPlayer().name) }}</div>
            <div class="tiles-left">{{ t('tilesLeft', state.market.length + state.drawPile.length) }}</div>
        </div>

        <div class="others-panel">
            <PlayerBoard
                v-for="(p, i) in otherPlayers"
                :key="p.name + i"
                :player="p"
                compact
                :is-active="false"
            />
        </div>

        <div class="market">
            <div class="market-label">{{ t('marketLabel') }}</div>
            <div class="market-tiles">
                <TileComponent
                    v-for="tile in state.market"
                    :key="tile.id"
                    :tile="tile"
                    interactive
                    :can-photo="canTakePhoto(tile, currentPlayer())"
                    :can-upgrade="canBuyUpgrade(tile, currentPlayer())"
                    @take-photo="takePhoto"
                    @buy-upgrade="buyUpgrade"
                />
            </div>
        </div>

        <button class="btn-pass" @click="pass">{{ t('pass') }}</button>

        <PlayerBoard :player="currentPlayer()" :is-active="true" />

        <CreditsFooter />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerBoard from './PlayerBoard.vue'
import TileComponent from './TileComponent.vue'
import CreditsFooter from './CreditsFooter.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, currentPlayer, canTakePhoto, canBuyUpgrade, takePhoto, buyUpgrade, pass } = useGameState()
const { t } = useLang()

const otherPlayers = computed(() =>
    state.players.filter((_, i) => i !== state.currentPlayerIndex)
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

.others-panel {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 900px;
}

.market {
    width: 100%;
    max-width: 900px;
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

.market-tiles {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.btn-pass {
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 8px 20px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
