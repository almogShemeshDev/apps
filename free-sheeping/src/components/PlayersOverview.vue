<template>
    <div class="overview">
        <div
            v-for="(p, i) in state.players"
            :key="p.name"
            class="player-card"
            :class="{ turn: i === state.turnIndex }"
        >
            <div class="player-header">
                <span class="name">{{ p.name }}</span>
                <span v-if="p.isBot" class="badge bot">{{ t('botBadge') }}</span>
                <span v-if="i === state.turnIndex" class="badge turn-badge">{{ t('turnBadge') }}</span>
            </div>
            <div class="stats-row">
                <span class="vp">⭐ {{ p.vp }} {{ t('vpLabel') }}</span>
                <span class="shipped">{{ t('productsWonLabel', p.productsWon.length) }}</span>
            </div>
            <div class="inventory">
                <span v-if="!p.specialInventory.length" class="none">{{ t('noSpecials') }}</span>
                <span v-for="(s, idx) in p.specialInventory" :key="idx" class="chip">
                    {{ specialIcon(s.defId) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { SPECIALS_BY_ID } from '../game/specials.js'

const { state } = useGameState()
const { t } = useLang()

function specialIcon(defId) {
    return SPECIALS_BY_ID[defId]?.icon ?? ''
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.overview {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 10px;
}

.player-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 10px 12px;

    &.turn {
        border-color: $gold;
        box-shadow: 0 0 0 1px $gold;
    }
}

.player-header {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.name {
    font-weight: 700;
    font-size: 0.92rem;
    color: $text;
}

.badge {
    border-radius: 6px;
    padding: 1px 7px;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge.bot {
    background: $teal;
    color: $ink;
}

.badge.turn-badge {
    background: $gold;
    color: $ink;
}

.stats-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: $text;
}

.shipped {
    color: $text-dim;
}

.inventory {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    min-height: 1.4em;
}

.chip {
    font-size: 0.9rem;
}

.none {
    color: $text-dim;
    font-size: 0.75rem;
}
</style>
