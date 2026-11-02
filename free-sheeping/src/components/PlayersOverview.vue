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
                <span class="vp">✨ {{ t('estScoreLabel', endgameScore(p.productsWon) - p.shippingPenalty) }}</span>
                <span class="shipped">{{ t('productsWonLabel', p.productsWon.length) }}</span>
            </div>
            <div v-if="p.shippingPenalty" class="penalty-row">{{ t('shippingPenaltyLabel', p.shippingPenalty) }}</div>
            <div class="collection">
                <span
                    v-for="cat in CATEGORIES"
                    :key="cat.id"
                    class="cat-count"
                    :class="[cat.id, { collected: countsFor(p)[cat.id] > 0 }]"
                    :title="categoryName(cat)"
                    :aria-label="categoryName(cat)"
                >
                    {{ cat.icon }}<span class="count">{{ countsFor(p)[cat.id] }}</span>
                </span>
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
import { CATEGORIES } from '../game/categories.js'
import { categoryCounts, endgameScore } from '../game/scoring.js'

const { state } = useGameState()
const { t, categoryName } = useLang()

function specialIcon(defId) {
    return SPECIALS_BY_ID[defId]?.icon ?? ''
}
function countsFor(player) {
    return categoryCounts(player.productsWon)
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

.penalty-row {
    font-size: 0.72rem;
    color: $danger;
}

.collection {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.cat-count {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    border-radius: 999px;
    background: $surface;
    border: 1px solid $border;
    font-size: 0.72rem;
    opacity: 0.55;
    transition:
        opacity 0.2s,
        border-color 0.2s;

    &.collected {
        opacity: 1;
    }

    &.fashion.collected {
        border-color: $cat-fashion;
    }
    &.home.collected {
        border-color: $cat-home;
    }
    &.tech.collected {
        border-color: $cat-tech;
    }
    &.food.collected {
        border-color: $cat-food;
    }
    &.leisure.collected {
        border-color: $cat-leisure;
    }

    .count {
        font-weight: 700;
        color: $text;
    }
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
