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
            <div ref="marketRowEl" class="market-row">
                <div v-for="(tile, idx) in state.market" :key="idx" class="market-slot">
                    <div class="position-label">
                        {{ t('positionLabel', idx + 1) }}
                    </div>
                    <TileComponent
                        v-if="tile"
                        :tile="tile"
                        interactive
                        :can-photo="!isBotTurn && canTakePhoto(tile, currentPlayer(), idx)"
                        :can-upgrade="!isBotTurn && canBuyUpgrade(currentPlayer(), idx)"
                        :upgrade-cost="tile.cost"
                        :upgrade-track="UPGRADE_TRACK_BY_INDEX[idx]"
                        :bonus-below="state.belowTokens[idx]"
                        :bonus-above="state.aboveTokens[idx]"
                        :can-gain-below="!isBotTurn && canGainTime('below', idx)"
                        :can-gain-above="!isBotTurn && canGainTime('above', idx)"
                        @take-photo="onTakePhoto(idx)"
                        @buy-upgrade="onBuyUpgrade(idx)"
                        @gain-below="gainTime('below', idx)"
                        @gain-above="gainTime('above', idx)"
                    />
                    <div v-else class="empty-slot">{{ t('emptySlot') }}</div>
                </div>
            </div>
        </div>

        <div class="fly-layer">
            <span v-for="tok in flyingTokens" :key="tok.id" class="flying-token" :style="tok.style">⏱</span>
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
import { computed, ref } from 'vue'
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

const marketRowEl = ref(null)
const flyingTokens = ref([])
let flyId = 0

function anchorRect(idx, selector) {
    const slot = marketRowEl.value?.children[idx]
    const el = slot?.querySelector(selector) ?? slot?.querySelector('.empty-slot')
    return el ? el.getBoundingClientRect() : null
}

function spawnFlight(fromRect, toRect, count) {
    if (!fromRect || !toRect) return
    const fromX = fromRect.left + fromRect.width / 2
    const fromY = fromRect.top + fromRect.height / 2
    const toX = toRect.left + toRect.width / 2
    const toY = toRect.top + toRect.height / 2
    for (let i = 0; i < count; i++) {
        const id = flyId++
        const jitterX = (Math.random() - 0.5) * 14
        const jitterY = (Math.random() - 0.5) * 10
        flyingTokens.value.push({
            id,
            style: {
                left: `${fromX + jitterX}px`,
                top: `${fromY + jitterY}px`,
                '--dx': `${toX - fromX}px`,
                '--dy': `${toY - fromY}px`,
                animationDelay: `${i * 70}ms`,
            },
        })
        setTimeout(() => {
            flyingTokens.value = flyingTokens.value.filter((tok) => tok.id !== id)
        }, 750 + i * 70)
    }
}

// Photograph payment always lands in the pile above this same position.
function onTakePhoto(idx) {
    const tile = state.market[idx]
    if (tile) spawnFlight(anchorRect(idx, '.photo-face'), anchorRect(idx, '.upgrade-face'), tile.cost)
    takePhoto(idx)
}

// Upgrade payment always lands in the pile below this same position.
function onBuyUpgrade(idx) {
    const tile = state.market[idx]
    if (tile) spawnFlight(anchorRect(idx, '.upgrade-face'), anchorRect(idx, '.photo-face'), tile.cost)
    buyUpgrade(idx)
}
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

.empty-slot {
    width: 150px;
    height: 246px;
    border: 2px dashed $border;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-dim;
    font-size: 0.75rem;
}

.fly-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
}

.flying-token {
    position: absolute;
    font-size: 1rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    animation: fly-token 0.7s ease-out forwards;
}

@keyframes fly-token {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.6);
        opacity: 0;
    }
}
</style>
