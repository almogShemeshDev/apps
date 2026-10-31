<template>
    <div class="cart">
        <div class="cart-header">
            <h3>{{ t('cartLabel') }}</h3>
            <div class="total" :class="statusClass">{{ t('totalLabel') }}: {{ effectiveTotal }}</div>
        </div>

        <div class="bar">
            <div class="bar-track">
                <div class="region below" :style="{ width: pct(minLimit) + '%' }"></div>
                <div class="region within" :style="{ width: pct(maxLimit) - pct(minLimit) + '%' }"></div>
                <div class="region above" :style="{ width: 100 - pct(maxLimit) + '%' }"></div>
                <div class="marker" :style="{ left: pct(effectiveTotal) + '%' }">{{ effectiveTotal }}</div>
            </div>
            <div class="bar-labels">
                <span>0</span>
                <span>{{ minLimit }}</span>
                <span>{{ maxLimit }}</span>
                <span>{{ scaleMax }}+</span>
            </div>
            <div class="status-line" :class="statusClass">{{ statusText }}</div>
        </div>

        <div class="category-strip">
            <div
                v-for="cat in CATEGORIES"
                :key="cat.id"
                class="cat-chip"
                :class="[cat.id, { collected: collectedCategories.has(cat.id) }]"
                :title="categoryName(cat)"
                :aria-label="categoryName(cat)"
            >
                {{ cat.icon }}
            </div>
            <div class="score-info">
                <span>{{ t('distinctCategories', collectedCategories.size) }}</span>
                <span class="score" :class="{ provisional: windowStatus !== 'within' }">
                    {{ t('potentialScore', potentialVp) }}
                </span>
            </div>
        </div>
        <p v-if="state.order.cards.length && windowStatus !== 'within'" class="provisional-note">
            {{ t('potentialScoreProvisional') }}
        </p>

        <div v-if="state.order.cards.length" class="cards">
            <TransitionGroup name="card-fly">
                <template v-for="(c, i) in state.order.cards" :key="c.instanceId">
                    <ProductCard
                        v-if="c.type === 'product'"
                        :def-id="c.defId"
                        :effective-price="effectivePriceOf(c)"
                        :is-new-category="isNewCategory(i)"
                    />
                    <SpecialCard v-else :def-id="c.defId" />
                </template>
            </TransitionGroup>
        </div>
        <p v-else class="empty">{{ t('emptyCart') }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import SpecialCard from './SpecialCard.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { CATEGORIES } from '../game/categories.js'
import { PRODUCTS_BY_ID } from '../game/products.js'

const { state, effectiveTotal, minLimit, maxLimit, windowStatus, effectivePriceOf, collectedCategories, potentialVp } =
    useGameState()
const { t, categoryName } = useLang()

const scaleMax = computed(() => Math.max(40, maxLimit.value + 10))
function pct(value) {
    return Math.max(0, Math.min(100, (value / scaleMax.value) * 100))
}

const statusClass = computed(() => `status-${windowStatus.value}`)
const statusText = computed(() => {
    if (windowStatus.value === 'below') return t('statusBelow')
    if (windowStatus.value === 'above') return t('statusAbove')
    return t('statusWithin')
})

// True when this card (by its position in the cart) was the first to bring
// its category into the order — used to briefly highlight new categories.
function isNewCategory(index) {
    const card = state.order.cards[index]
    if (card.type !== 'product') return false
    const category = PRODUCTS_BY_ID[card.defId].category
    for (let i = 0; i < index; i++) {
        const prior = state.order.cards[i]
        if (prior.type === 'product' && PRODUCTS_BY_ID[prior.defId].category === category) return false
    }
    return true
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.cart {
    width: 100%;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        font-size: 0.95rem;
        color: $text;
    }
}

.total {
    font-weight: 700;
    font-size: 1rem;
    padding: 2px 10px;
    border-radius: 999px;

    &.status-below {
        color: $text-dim;
        background: $surface;
    }
    &.status-within {
        color: $success;
        background: rgba(95, 167, 119, 0.15);
    }
    &.status-above {
        color: $danger;
        background: rgba(217, 83, 79, 0.12);
    }
}

.bar {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.bar-track {
    position: relative;
    display: flex;
    height: 16px;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid $border;
}

.region {
    height: 100%;
    &.below {
        background: rgba(74, 63, 47, 0.12);
    }
    &.within {
        background: rgba(95, 167, 119, 0.4);
    }
    &.above {
        background: rgba(217, 83, 79, 0.3);
    }
}

.marker {
    position: absolute;
    top: -6px;
    transform: translateX(-50%);
    background: $ink;
    color: $cream;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
    transition: left 0.3s ease;
    white-space: nowrap;
}

.bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.62rem;
    color: $text-dim;
}

.status-line {
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;

    &.status-below {
        color: $text-dim;
    }
    &.status-within {
        color: $success;
    }
    &.status-above {
        color: $danger;
    }
}

.category-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 8px 10px;
    background: $surface;
    border-radius: 10px;
}

.cat-chip {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    background: $bg-panel;
    border: 2px solid $border;
    opacity: 0.4;
    transition:
        opacity 0.2s,
        border-color 0.2s,
        transform 0.2s;

    &.collected {
        opacity: 1;
        transform: scale(1.08);
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
}

.score-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-inline-start: auto;
    font-size: 0.74rem;
    color: $text-dim;
    text-align: end;

    .score {
        font-weight: 700;
        color: $gold;

        &.provisional {
            color: $text-dim;
            font-style: italic;
        }
    }
}

.provisional-note {
    font-size: 0.68rem;
    color: $text-dim;
    font-style: italic;
    text-align: center;
    margin-top: -4px;
}

.cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.empty {
    color: $text-dim;
    font-size: 0.85rem;
    text-align: center;
    padding: 12px 0;
}

.card-fly-enter-active {
    animation: fly-in 0.35s ease;
}

@keyframes fly-in {
    from {
        transform: translateY(-16px) scale(0.6);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>
