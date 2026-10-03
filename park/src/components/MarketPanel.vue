<template>
    <div class="market">
        <span class="market-label">{{ t('marketLabel') }}</span>
        <div class="market-cards">
            <CardTile
                v-for="cardId in Object.keys(market)"
                :key="cardId"
                mode="market"
                :card-id="cardId"
                :remaining="market[cardId]"
                :can-buy="canBuyCard(cardId)"
                @buy="$emit('buy-card', cardId)"
            />
        </div>
    </div>
</template>

<script setup>
import CardTile from './CardTile.vue'
import { useLang } from '../composables/useLang.js'

defineProps({
    market: { type: Object, required: true },
    canBuyCard: { type: Function, required: true },
})
defineEmits(['buy-card'])

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.market {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.market-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
}

.market-cards {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
