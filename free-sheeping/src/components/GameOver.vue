<template>
    <div class="game-over">
        <h1 class="title">{{ t('gameOverTitle') }}</h1>

        <div class="standings">
            <p class="standings-label">{{ t('finalStandings') }}</p>
            <div v-for="p in ranked" :key="p.name" class="row" :class="{ winner: isWinner(p) }">
                <span class="name">{{ p.name }}</span>
                <span class="shipped">{{ t('productsWonLabel', p.shipped) }}</span>
                <span class="vp">⭐ <span dir="ltr">{{ p.vp }}</span></span>
            </div>
            <p class="winner-line">
                {{ tiedForFirst ? t('tiedLabel') : t('winnerLabel', ranked[0]?.name) }}
            </p>
        </div>

        <button class="btn-again" @click="$emit('play-again')">{{ t('playAgain') }}</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    players: { type: Array, required: true },
})
defineEmits(['play-again'])

const { t } = useLang()

const ranked = computed(() =>
    [...props.players]
        .map((p) => ({ name: p.name, vp: p.vp, shipped: p.productsWon.length }))
        .sort((a, b) => b.vp - a.vp || b.shipped - a.shipped)
)
const top = computed(() => ranked.value[0])
const tiedForFirst = computed(
    () => top.value && ranked.value.filter((p) => p.vp === top.value.vp && p.shipped === top.value.shipped).length > 1
)
function isWinner(p) {
    return top.value && p.vp === top.value.vp && p.shipped === top.value.shipped
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-over {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px;
}

.title {
    font-size: 2.2rem;
    font-weight: 700;
    color: $gold;
    letter-spacing: 0.02em;
}

.standings {
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 24px 32px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-shadow: 0 6px 20px rgba(74, 63, 47, 0.08);
}

.standings-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
}

.row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.95rem;

    .shipped {
        color: $text-dim;
        font-size: 0.85rem;
    }

    &.winner {
        background: rgba(232, 162, 61, 0.15);
        color: $gold;
        font-weight: 700;

        .shipped {
            color: $gold;
        }
    }
}

.winner-line {
    margin-top: 8px;
    font-size: 1rem;
    font-weight: 700;
    color: $gold;
}

.btn-again {
    background: $gold;
    color: $ink;
    border: none;
    padding: 13px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: background 0.15s;

    &:hover {
        background: $gold-light;
    }
}
</style>
