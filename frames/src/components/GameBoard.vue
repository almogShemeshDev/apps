<template>
    <div class="game-board">
        <div class="header">
            <div class="turn-info">
                {{ isBotTurn ? t('botThinking', currentPlayer().name) : t('yourTurn', currentPlayer().name) }}
            </div>
            <div class="status-info">
                <div class="tiles-left">
                    {{ t('tilesLeft', state.market.filter((t) => t).length + state.drawPile.length) }}
                </div>
                <div class="photos-progress">
                    {{ t('photosProgress', totalPhotos(), photoThreshold()) }}
                </div>
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
                    <div class="position-label">
                        {{ t('positionLabel', idx + 1) }}
                        <span v-if="idx === state.equipmentDieIndex" class="die-marker" :title="t('trackName', 'equipment')">🎲📷</span>
                        <span v-if="idx === state.creativityDieIndex" class="die-marker" :title="t('trackName', 'creativity')">🎲💡</span>
                    </div>
                    <button
                        class="btn-gain above"
                        :disabled="isBotTurn || !canGainTime('above', idx)"
                        @click="gainTime('above', idx)"
                    >
                        {{ t('gainAboveBtn', state.aboveTokens[idx]) }}
                    </button>
                    <TileComponent
                        v-if="tile"
                        :tile="tile"
                        interactive
                        :can-photo="!isBotTurn && canTakePhoto(tile, currentPlayer(), idx)"
                        :can-upgrade="!isBotTurn && canBuyUpgrade(currentPlayer(), idx)"
                        :upgrade-cost="tile.cost"
                        :upgrade-track="UPGRADE_TRACK_BY_INDEX[idx]"
                        :has-equipment-die="idx === state.equipmentDieIndex"
                        :has-creativity-die="idx === state.creativityDieIndex"
                        @take-photo="takePhoto(idx)"
                        @buy-upgrade="buyUpgrade(idx)"
                    />
                    <div v-else class="empty-slot">{{ t('emptySlot') }}</div>
                    <button
                        class="btn-gain below"
                        :disabled="isBotTurn || !canGainTime('below', idx)"
                        @click="gainTime('below', idx)"
                    >
                        {{ t('gainBelowBtn', state.belowTokens[idx]) }}
                    </button>
                </div>
            </div>
        </div>

        <button
            v-if="!isBotTurn && hasNoLegalAction()"
            class="btn-pass"
            @click="skipTurn()"
        >
            {{ t('passBtn') }}
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerBoard from './PlayerBoard.vue'
import TileComponent from './TileComponent.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { UPGRADE_TRACK_BY_INDEX } from '../constants.js'

const {
    state,
    currentPlayer,
    totalPhotos,
    photoThreshold,
    canTakePhoto,
    canBuyUpgrade,
    canGainTime,
    hasNoLegalAction,
    takePhoto,
    buyUpgrade,
    gainTime,
    skipTurn,
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

.status-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.tiles-left,
.photos-progress {
    font-size: 0.85rem;
    color: $text-dim;
}

.btn-pass {
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
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
    display: flex;
    align-items: center;
    gap: 4px;
}

.die-marker {
    font-size: 0.75rem;
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

.btn-gain {
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
