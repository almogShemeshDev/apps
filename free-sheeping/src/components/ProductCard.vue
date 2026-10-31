<template>
    <div class="product-card" :class="[category.id, { discounted }]">
        <div
            class="category-badge"
            :title="categoryName(category)"
            :aria-label="categoryName(category)"
        >
            {{ category.icon }}
        </div>
        <div class="icon">{{ def.icon }}</div>
        <div class="name">{{ cardName(def) }}</div>
        <div class="stats">
            <span class="price" :class="{ struck: discounted }">💰 {{ def.price }}</span>
            <span v-if="discounted" class="price effective">💰 {{ effectivePrice }}</span>
        </div>
        <div class="category-name">{{ categoryName(category) }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { PRODUCTS_BY_ID } from '../game/products.js'
import { CATEGORIES_BY_ID } from '../game/categories.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    defId: { type: String, required: true },
    effectivePrice: { type: Number, default: null },
})

const { cardName, categoryName } = useLang()
const def = computed(() => PRODUCTS_BY_ID[props.defId])
const category = computed(() => CATEGORIES_BY_ID[def.value.category])
const discounted = computed(() => props.effectivePrice !== null && props.effectivePrice < def.value.price)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

@keyframes card-pop {
    0% {
        transform: scale(0) translateY(10px) rotate(-4deg);
        opacity: 0;
    }
    60% {
        transform: scale(1.08) translateY(-3px) rotate(1deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(0) rotate(0);
    }
}

.product-card {
    width: 118px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    background: $bg-panel;
    border: 2px solid $border;
    border-radius: 12px;
    padding: 10px 8px 8px;
    text-align: center;
    animation: card-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 3px 8px rgba(74, 63, 47, 0.1);

    &.discounted {
        border-color: $teal;
    }

    &.fashion {
        --cat-color: #{$cat-fashion};
    }
    &.home {
        --cat-color: #{$cat-home};
    }
    &.tech {
        --cat-color: #{$cat-tech};
    }
    &.food {
        --cat-color: #{$cat-food};
    }
    &.leisure {
        --cat-color: #{$cat-leisure};
    }
}

.category-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--cat-color, $border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    box-shadow: 0 1px 4px rgba(74, 63, 47, 0.25);
}

.category-name {
    font-size: 0.56rem;
    font-weight: 700;
    color: var(--cat-color, $text-dim);
    letter-spacing: 0.02em;
}

.icon {
    font-size: 1.8rem;
    line-height: 1;
}

.name {
    font-size: 0.68rem;
    font-weight: 700;
    color: $text;
    min-height: 2.2em;
    line-height: 1.1;
}

.stats {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
}

.price {
    color: $danger;

    &.struck {
        text-decoration: line-through;
        opacity: 0.6;
    }

    &.effective {
        color: $teal;
        text-decoration: none;
    }
}
</style>
