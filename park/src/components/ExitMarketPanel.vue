<template>
    <div class="exit-market">
        <span class="market-label">{{ t('exitMarketLabel') }}</span>
        <div class="market-cards">
            <ExitCardTile
                v-for="cardId in Object.keys(exitMarket)"
                :key="cardId"
                :card-id="cardId"
                :remaining="exitMarket[cardId]"
                :can-buy="canBuyExitCard(cardId)"
                @buy="$emit('buy-exit-card', cardId)"
            />
        </div>
    </div>
</template>

<script setup>
import ExitCardTile from './ExitCardTile.vue'
import { useLang } from '../composables/useLang.js'

defineProps({
    exitMarket: { type: Object, required: true },
    canBuyExitCard: { type: Function, required: true },
})
defineEmits(['buy-exit-card'])

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.exit-market {
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    width: 100%;
}
</style>
