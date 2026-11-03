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
                <button type="button" class="vp-toggle" @click="toggleBreakdown(i)">
                    <span class="vp">✨ {{ t('estScoreLabel', totalScoreFor(p)) }}</span>
                    <span class="toggle-arrow">{{ expanded.has(i) ? '▲' : '▼' }}</span>
                </button>
                <span class="shipped">{{ t('productsWonLabel', p.productsWon.length) }}</span>
            </div>
            <div v-if="p.shippingPenalty" class="penalty-row">
                <span>{{ t('shippingPenaltyLabel', p.shippingPenalty) }}</span>
                <PenaltyCards :count="p.shippingPenalty" />
            </div>

            <div v-if="expanded.has(i)" class="breakdown">
                <p class="breakdown-title">{{ t('scoreBreakdownTitle') }}</p>
                <div v-for="cat in CATEGORIES" :key="cat.id" class="breakdown-row">
                    <span class="bd-icon">{{ cat.icon }}</span>
                    <span class="bd-count">{{ countsFor(p)[cat.id] }}</span>
                    <span class="bd-points" dir="ltr">+{{ scoreForCategoryProductCount(countsFor(p)[cat.id]) }}</span>
                </div>
                <div v-if="hasDiversityBonus(countsFor(p))" class="breakdown-row bonus">
                    <span>{{ t('diversityBonusLabel') }}</span>
                    <span dir="ltr">+5</span>
                </div>
                <div v-if="p.shippingPenalty" class="breakdown-row penalty">
                    <span>{{ t('shippingPenaltyLabel', p.shippingPenalty) }}</span>
                    <span dir="ltr">-{{ p.shippingPenalty }}</span>
                </div>
                <div class="breakdown-row total">
                    <span>{{ t('totalScoreLabel') }}</span>
                    <span dir="ltr">{{ totalScoreFor(p) }}</span>
                </div>
            </div>
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
import { ref } from 'vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { SPECIALS_BY_ID } from '../game/specials.js'
import PenaltyCards from './PenaltyCards.vue'
import { CATEGORIES } from '../game/categories.js'
import { categoryCounts, endgameScore, hasDiversityBonus, scoreForCategoryProductCount } from '../game/scoring.js'

const { state } = useGameState()
const { t, categoryName } = useLang()

const expanded = ref(new Set())
function toggleBreakdown(i) {
    if (expanded.value.has(i)) expanded.value.delete(i)
    else expanded.value.add(i)
}

function specialIcon(defId) {
    return SPECIALS_BY_ID[defId]?.icon ?? ''
}
function countsFor(player) {
    return categoryCounts(player.productsWon)
}
function totalScoreFor(player) {
    return endgameScore(player.productsWon) - player.shippingPenalty
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
    align-items: center;
    font-size: 0.8rem;
    color: $text;
}

.vp-toggle {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
}

.toggle-arrow {
    font-size: 0.6rem;
    color: $text-dim;
}

.shipped {
    color: $text-dim;
}

.breakdown {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: $surface;
    border-radius: 8px;
    padding: 6px 8px;
}

.breakdown-title {
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-dim;
    margin: 0 0 2px;
}

.breakdown-row {
    display: grid;
    grid-template-columns: 1.2em 1fr auto;
    gap: 6px;
    align-items: center;
    font-size: 0.74rem;
    color: $text-dim;

    .bd-count {
        color: $text;
    }

    .bd-points {
        min-width: 2em;
        text-align: end;
    }

    &.bonus,
    &.penalty,
    &.total {
        grid-template-columns: 1fr auto;
        padding-top: 3px;
        margin-top: 2px;
        border-top: 1px dashed $border;
    }

    &.bonus {
        color: $teal;
        font-weight: 700;
    }

    &.penalty {
        color: $danger;
        font-weight: 700;
    }

    &.total {
        color: $text;
        font-weight: 700;
    }
}

.penalty-row {
    display: flex;
    align-items: center;
    gap: 6px;
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
    gap: 3px;
    padding: 3px 9px;
    border-radius: 999px;
    background: $bg-panel;
    border: 2px solid $border;
    font-size: 0.9rem;
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
