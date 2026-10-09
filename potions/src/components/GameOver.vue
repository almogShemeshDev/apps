<template>
    <div class="game-over">
        <h1 class="title">{{ t('gameOverTitle') }}</h1>

        <div class="standings">
            <p class="standings-label">{{ t('finalStandings') }}</p>
            <div v-for="p in ranked" :key="p.name" class="row" :class="{ winner: p.vp === topVp }">
                <span class="name">{{ p.name }}</span>
                <span class="cards">
                    {{ t('cardsLeftLabel', p.cardCount) }}
                    <template v-if="p.flipPenalty">· <span dir="ltr">-{{ p.flipPenalty }}</span> {{ t('flipPenaltyLabel') }}</template>
                </span>
                <span class="vp">🏆 <span dir="ltr">{{ p.vp }}</span></span>
            </div>
            <p class="winner-line">
                {{ tiedForFirst ? t('tiedLabel') : t('winnerLabel', ranked[0].name) }}
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
        .map((p) => ({
            name: p.name,
            cardCount: p.hand.length,
            flipPenalty: p.flipPenalty || 0,
            vp: -p.hand.length - (p.flipPenalty || 0),
        }))
        .sort((a, b) => b.vp - a.vp)
)
const topVp = computed(() => ranked.value[0]?.vp ?? 0)
const tiedForFirst = computed(() => ranked.value.filter((p) => p.vp === topVp.value).length > 1)
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
    letter-spacing: 0.04em;
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

    .cards {
        color: $text-dim;
        font-size: 0.85rem;
    }

    &.winner {
        background: rgba(178, 101, 255, 0.15);
        color: $gold;
        font-weight: 700;

        .cards {
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
    color: $bg-dark;
    border: none;
    padding: 13px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.15s;

    &:hover {
        background: $gold-light;
    }
}
</style>
