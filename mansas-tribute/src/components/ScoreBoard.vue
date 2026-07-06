<template>
    <div class="scoreboard">
        <h1>{{ t('gameOver') }}</h1>
        <div class="rows">
            <div
                v-for="(s, i) in sorted"
                :key="s.name"
                class="row"
                :class="{ winner: i === 0 }"
            >
                <div class="row-main">
                    <span class="rank">{{ i + 1 }}</span>
                    <span class="name">{{ s.name }}</span>
                    <span class="breakdown">
                        {{ t('trickCount', s.tricks) }}
                        <span class="plus">+</span>
                        {{ s.bonus }} {{ t('bonus') }}
                        <span class="equals">=</span>
                        <span class="total">{{ s.total }}</span>
                    </span>
                </div>
                <div class="row-dice">
                    <span class="dice-label">{{ t('remainingDiceLabel') }}</span>
                    <div class="dice-list">
                        <DiceComponent v-for="die in s.dice" :key="die.id" :die="die" />
                        <span v-if="!s.dice.length" class="no-dice">{{ t('noDice') }}</span>
                    </div>
                    <span class="dice-sum">{{ t('diceSumOverTricks', s.diceSum, s.tricks) }}</span>
                </div>
            </div>
        </div>
        <div class="formula-note">{{ t('formulaNote') }}</div>
        <button class="btn-again" @click="$emit('playAgain')">{{ t('playAgain') }}</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import DiceComponent from './DiceComponent.vue'
import { useLang } from '../composables/useLang.js'

const props = defineProps({ players: { type: Array, required: true } })
defineEmits(['playAgain'])

const { t } = useLang()

const sorted = computed(() =>
    props.players
        .map((p) => {
            const diceSum = p.dice.reduce((s, d) => s + d.value, 0)
            const bonus = p.tricks > 0 ? Math.floor(diceSum / p.tricks) : 0
            return { name: p.name, tricks: p.tricks, dice: p.dice, diceSum, bonus, total: p.tricks + bonus }
        })
        .sort((a, b) => b.total - a.total || b.tricks - a.tricks)
)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.scoreboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px;
}

h1 {
    font-size: 2rem;
    font-weight: 700;
    color: $gold;
    letter-spacing: 0.04em;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 320px;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 10px;
    background: $surface;
    border: 1px solid $border;

    &.winner {
        border-color: $gold;
        background: rgba($gold, 0.1);

        .rank {
            color: $gold;
        }
        .total {
            color: $gold;
        }
    }
}

.row-main {
    display: flex;
    align-items: center;
    gap: 12px;
}

.row-dice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline-start: 36px;
}

.dice-label {
    font-size: 0.72rem;
    color: $text-dim;
    opacity: 0.7;
    white-space: nowrap;
}

.dice-list {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;

    :deep(.die) {
        width: 26px;
        height: 26px;
        font-size: 0.85rem;
        border-width: 1px;
    }
}

.no-dice {
    font-size: 0.8rem;
    color: $text-dim;
    opacity: 0.6;
}

.dice-sum {
    font-size: 0.78rem;
    color: $text-dim;
    opacity: 0.8;
    white-space: nowrap;
}

.rank {
    font-weight: 700;
    font-size: 1.1rem;
    width: 24px;
    color: $text-dim;
}

.name {
    flex: 1;
    font-weight: 600;
}

.breakdown {
    font-size: 0.88rem;
    color: $text-dim;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}

.plus,
.equals {
    color: $text-dim;
    opacity: 0.6;
}

.total {
    font-weight: 700;
    font-size: 1rem;
    color: $text;
}

.formula-note {
    font-size: 0.72rem;
    color: $text-dim;
    opacity: 0.6;
    text-align: center;
    max-width: 320px;
}

.btn-again {
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: $gold-light;
    }
}
</style>
