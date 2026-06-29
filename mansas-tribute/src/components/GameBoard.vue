<template>
    <div class="game-board">
        <!-- Header -->
        <div class="header">
            <div class="round-info">{{ t('roundInfo', state.round) }}</div>
            <div class="king-lead-badge" :style="{ background: leadSuitColor }">
                {{ leadSuitSym }} {{ t('kingsLead') }} {{ state.leadSuit }}
            </div>
            <div class="scores">
                <span v-for="p in state.players" :key="p.name" class="score-pill">
                    {{ p.name }}: {{ p.tricks }}
                </span>
            </div>
        </div>

        <!-- All players' dice (always visible) -->
        <div class="players-panel">
            <div
                v-for="(p, i) in state.players"
                :key="p.name"
                class="player-strip"
                :class="{ 'is-active': state.currentPlayerIndex === i && state.phase === 'playing' }"
            >
                <div class="strip-name">{{ p.name }}</div>
                <div class="strip-dice">
                    <DiceComponent v-for="die in p.dice" :key="die.id" :die="die" />
                    <span v-if="!p.dice.length" class="no-dice">—</span>
                </div>
            </div>
        </div>

        <!-- Main area: king + trick -->
        <div class="main">
            <!-- King's lead card -->
            <div class="king-area">
                <div class="area-label">{{ t('kingsLead') }}</div>
                <CardComponent v-if="state.king.revealed" :card="state.king.revealed" />
                <div class="king-sub">{{ t('cardsLeft', 8 - state.round) }}</div>
            </div>

            <!-- Trick in progress -->
            <div class="trick-area">
                <div class="area-label">
                    {{ t('currentTrick') }}
                    <span class="lead-suit" :style="{ color: leadSuitColor }">
                        - {{ t('follow') }} {{ leadSuitSym }} {{ state.leadSuit }}
                    </span>
                </div>

                <div v-if="!state.trick.length" class="trick-empty">
                    {{ t('playsFirst', currentPlayer.name) }}
                </div>

                <div class="trick-entries">
                    <div
                        v-for="entry in state.trick"
                        :key="entry.playerIndex"
                        class="trick-entry"
                        :class="{ 'is-winner': state.trickResult?.winnerIndex === entry.playerIndex }"
                    >
                        <div class="entry-name">{{ state.players[entry.playerIndex].name }}</div>
                        <CardComponent :card="entry.card" />
                        <div class="entry-dice">
                            <DiceComponent v-for="d in entry.dice" :key="d.id" :die="d" />
                            <span v-if="!entry.dice.length" class="no-dice">{{ t('zeroDice') }}</span>
                        </div>
                        <div v-if="entry.dice.length" class="entry-total">
                            = {{ entryTotal(entry) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Current player action area -->
        <div v-if="state.phase === 'playing'" class="player-area">
            <!-- Bot thinking -->
            <div v-if="currentPlayerIsBot" class="bot-thinking">
                {{ t('botThinking', currentPlayer.name) }}
            </div>

            <!-- Human player UI -->
            <template v-else>
                <div class="player-label">{{ t('yourTurn', currentPlayer.name) }}</div>

                <div class="section">
                    <div class="section-label">{{ t('handLabel') }}</div>
                    <div class="cards-row">
                        <CardComponent
                            v-for="card in currentPlayer.hand"
                            :key="card.id"
                            :card="card"
                            :selectable="isLegal(card)"
                            :selected="selectedCard?.id === card.id"
                            :dimmed="!isLegal(card)"
                            @select="toggleCard(card)"
                        />
                    </div>
                </div>

                <div class="section">
                    <div class="section-label">
                        {{ t('diceLabel') }}
                        <span v-if="selectedDiceIds.length" class="total-badge">
                            {{ t('diceTotal', selectedTotal) }}
                        </span>
                    </div>
                    <div class="dice-row">
                        <DiceComponent
                            v-for="die in currentPlayer.dice"
                            :key="die.id"
                            :die="die"
                            selectable
                            :selected="selectedDiceIds.includes(die.id)"
                            @select="toggleDie(die.id)"
                        />
                        <span v-if="!currentPlayer.dice.length" class="no-dice">{{ t('noDice') }}</span>
                    </div>
                </div>

                <button class="btn-play" :disabled="!selectedCard" @click="play">
                    <span v-if="selectedCard">
                        <template v-if="selectedDiceIds.length">
                            {{ t('playCardWithDice', selectedCard.suit, selectedDiceIds.length, selectedTotal) }}
                        </template>
                        <template v-else>
                            {{ t('playCard', selectedCard.suit) }}
                        </template>
                    </span>
                    <span v-else>{{ t('selectCard') }}</span>
                </button>
            </template>
        </div>

        <!-- Overlays -->
        <TrickResultOverlay
            v-if="state.phase === 'trick-result'"
            :result="state.trickResult"
            :players="state.players"
            @continue="proceedToDicePicking"
        />
        <DicePickingPhase v-if="state.phase === 'dice-picking'" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CardComponent from './CardComponent.vue'
import DiceComponent from './DiceComponent.vue'
import TrickResultOverlay from './TrickResultOverlay.vue'
import DicePickingPhase from './DicePickingPhase.vue'
import { useGameState } from '../composables/useGameState.js'
import { isLegalPlay, diceTotal } from '../composables/useTrickLogic.js'
import { SUIT_COLORS, SUIT_SYMBOLS } from '../constants.js'
import { useLang } from '../composables/useLang.js'

const { state, playCard, proceedToDicePicking } = useGameState()
const { t } = useLang()

const selectedCard = ref(null)
const selectedDiceIds = ref([])

const currentPlayer = computed(() => state.players[state.currentPlayerIndex])
const currentPlayerIsBot = computed(() => state.players[state.currentPlayerIndex]?.isBot === true)
const leadSuitColor = computed(() => (state.leadSuit ? SUIT_COLORS[state.leadSuit] : null))
const leadSuitSym = computed(() => (state.leadSuit ? SUIT_SYMBOLS[state.leadSuit] : null))
const selectedTotal = computed(() =>
    selectedDiceIds.value.reduce((s, id) => {
        const die = currentPlayer.value.dice.find((d) => d.id === id)
        return s + (die?.value ?? 0)
    }, 0)
)

watch(
    () => state.currentPlayerIndex,
    () => {
        selectedCard.value = null
        selectedDiceIds.value = []
    }
)

const legalCardIds = computed(() => {
    const hand = currentPlayer.value?.hand ?? []
    return new Set(
        hand.filter((card) => isLegalPlay(card, hand, state.leadSuit)).map((card) => card.id)
    )
})

function isLegal(card) {
    return legalCardIds.value.has(card.id)
}

function toggleCard(card) {
    selectedCard.value = selectedCard.value?.id === card.id ? null : card
}

function toggleDie(id) {
    const idx = selectedDiceIds.value.indexOf(id)
    if (idx !== -1) selectedDiceIds.value.splice(idx, 1)
    else selectedDiceIds.value.push(id)
}

function entryTotal(entry) {
    return diceTotal(entry.dice)
}

function play() {
    if (!selectedCard.value) return
    playCard(selectedCard.value, [...selectedDiceIds.value])
    selectedCard.value = null
    selectedDiceIds.value = []
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-board {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid $border;
    flex-wrap: wrap;
}

.round-info {
    font-weight: 700;
    font-size: 0.85rem;
    color: $text-dim;
    white-space: nowrap;
}

.king-lead-badge {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    color: #fff;
    letter-spacing: 0.03em;
    white-space: nowrap;
}

.scores {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-left: auto;
}

.score-pill {
    font-size: 0.8rem;
    color: $text-dim;
    background: $surface;
    border: 1px solid $border;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
}

.players-panel {
    display: flex;
    gap: 0;
    border-bottom: 1px solid $border;
    overflow-x: auto;
}

.player-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-right: 1px solid $border;
    flex-shrink: 0;
    transition: background 0.2s;

    &.is-active {
        background: rgba($gold, 0.07);
    }

    &:last-child {
        border-right: none;
    }
}

.strip-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: $text-dim;
    white-space: nowrap;
    min-width: 48px;
}

.strip-dice {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    align-items: center;
}

.main {
    display: flex;
    gap: 0;
    flex: 1;
    border-bottom: 1px solid $border;
    min-height: 0;
}

.area-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
    margin-bottom: 10px;
}

.lead-suit {
    font-weight: 700;
    text-transform: none;
    letter-spacing: 0;
}

.king-area {
    padding: 16px;
    border-right: 1px solid $border;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 100px;
}

.king-sub {
    font-size: 0.72rem;
    color: $text-dim;
    white-space: nowrap;
}

.trick-area {
    flex: 1;
    padding: 16px;
    overflow-x: auto;
}

.trick-empty {
    color: $text-dim;
    font-size: 0.9rem;
    margin-top: 8px;
}

.trick-entries {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 4px;
}

.trick-entry {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 10px;
    background: $surface;
    border: 1px solid $border;
    transition: border-color 0.2s;

    &.is-winner {
        border-color: $gold;
        background: rgba($gold, 0.08);
    }
}

.entry-name {
    font-size: 0.75rem;
    color: $text-dim;
    font-weight: 600;
}

.entry-dice {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
}

.entry-total {
    font-size: 0.78rem;
    font-weight: 700;
    color: $gold;
}

.no-dice {
    font-size: 0.75rem;
    color: $text-dim;
    font-style: italic;
}

.player-area {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: rgba(0, 0, 0, 0.15);
}

.bot-thinking {
    font-size: 1rem;
    color: $text-dim;
    font-style: italic;
    padding: 12px 0;
    letter-spacing: 0.03em;
}

.player-label {
    font-size: 1rem;
    font-weight: 700;
    color: $gold;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: flex;
    align-items: center;
    gap: 8px;
}

.total-badge {
    background: $gold;
    color: $bg-dark;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 20px;
    text-transform: none;
    letter-spacing: 0;
}

.cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.dice-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.btn-play {
    align-self: flex-start;
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 11px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition:
        background 0.15s,
        opacity 0.15s;
    letter-spacing: 0.02em;

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }

    &:not(:disabled):hover {
        background: $gold-light;
    }
}
</style>
