<template>
    <div class="game-over">
        <h1 class="title">{{ t('gameOverTitle') }}</h1>

        <div class="standings">
            <p class="standings-label">{{ t('finalStandings') }}</p>

            <div v-for="p in ranked" :key="p.name" class="player-result" :class="{ winner: isWinner(p) }">
                <div class="result-header">
                    <span class="name">{{ p.name }}</span>
                    <span class="total-score">⭐ <span dir="ltr">{{ p.score }}</span></span>
                </div>

                <div class="breakdown">
                    <div v-for="cat in CATEGORIES" :key="cat.id" class="cat-row">
                        <span class="icon">{{ cat.icon }}</span>
                        <span class="cat-name">{{ categoryName(cat) }}</span>
                        <span class="cat-count">{{ p.counts[cat.id] }}</span>
                        <span class="cat-points" dir="ltr">+{{ scoreForCategoryProductCount(p.counts[cat.id]) }}</span>
                    </div>
                    <div v-if="p.bonus" class="bonus-row">
                        <span>{{ t('diversityBonusLabel') }}</span>
                        <span dir="ltr">+5</span>
                    </div>
                    <div class="total-row">
                        <span>{{ t('totalScoreLabel') }}</span>
                        <span dir="ltr">{{ p.score }}</span>
                    </div>
                </div>
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
import { CATEGORIES } from '../game/categories.js'
import { categoryCounts, hasDiversityBonus, endgameScore, scoreForCategoryProductCount } from '../game/scoring.js'

const props = defineProps({
    players: { type: Array, required: true },
})
defineEmits(['play-again'])

const { t, categoryName } = useLang()

const ranked = computed(() =>
    [...props.players]
        .map((p) => {
            const counts = categoryCounts(p.productsWon)
            return {
                name: p.name,
                shipped: p.productsWon.length,
                counts,
                bonus: hasDiversityBonus(counts),
                score: endgameScore(p.productsWon),
            }
        })
        .sort((a, b) => b.score - a.score || b.shipped - a.shipped)
)
const top = computed(() => ranked.value[0])
const tiedForFirst = computed(() => top.value && ranked.value.filter((p) => p.score === top.value.score).length > 1)
function isWinner(p) {
    return top.value && p.score === top.value.score
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
    max-width: 420px;
    width: 100%;
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

.player-result {
    width: 100%;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 10px 14px;

    &.winner {
        border-color: $gold;
        background: rgba(232, 162, 61, 0.08);
    }
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    font-weight: 700;
    color: $text;

    .total-score {
        color: $gold;
    }
}

.player-result.winner .result-header {
    color: $gold;
}

.breakdown {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.cat-row {
    display: grid;
    grid-template-columns: 1.2em 1fr auto auto;
    gap: 6px;
    align-items: center;
    font-size: 0.78rem;
    color: $text-dim;

    .cat-name {
        text-align: start;
    }

    .cat-count {
        color: $text;
    }

    .cat-points {
        min-width: 2.2em;
        text-align: end;
        color: $text-dim;
    }
}

.bonus-row,
.total-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    padding-top: 4px;
    margin-top: 2px;
    border-top: 1px dashed $border;
}

.bonus-row {
    color: $teal;
    font-weight: 700;
}

.total-row {
    color: $text;
    font-weight: 700;
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
