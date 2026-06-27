<template>
    <div class="bidding-phase">
        <h1 class="title">🌳 One-Two-Tree</h1>

        <div class="panel">
            <p class="prompt">
                <strong>{{ currentPlayer.name }}</strong
                >{{ t('pickBidSuffix') }}
            </p>
            <p class="hint">{{ t('bidHint') }}</p>
            <p class="progress">{{ t('playerOf', state.biddingIndex + 1, state.players.length) }}</p>

            <div v-if="currentPlayer.isBot" class="bot-thinking">
                {{ t('botThinking') }}
            </div>
            <template v-else>
                <div class="cards">
                    <CardComponent
                        v-for="card in currentPlayer.hand"
                        :key="card.id"
                        :card="card"
                        :selectable="true"
                        :selected="selected?.id === card.id"
                        @select="selected = card"
                    />
                </div>
                <button class="btn-confirm" :disabled="!selected" @click="confirm">
                    {{ t('confirmBid') }}
                </button>
            </template>
        </div>

        <CreditsFooter />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CardComponent from './CardComponent.vue'
import CreditsFooter from './CreditsFooter.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, placeInitialBid } = useGameState()
const { t } = useLang()

const selected = ref(null)
const currentPlayer = computed(() => state.players[state.biddingIndex])

function confirm() {
    if (!selected.value) return
    placeInitialBid(currentPlayer.value.id, selected.value)
    selected.value = null
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.bidding-phase {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 40px 20px;
    background: $bg-dark;
    color: $text;
}
.title {
    font-size: 2.4rem;
    font-weight: 900;
    margin: 0;
}
.panel {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 32px;
    max-width: 640px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}
.prompt {
    font-size: 1.2rem;
    margin: 0;
}
.hint {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
    text-align: center;
}
.progress {
    font-size: 0.8rem;
    color: $muted;
    margin: 0;
}
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}
.btn-confirm {
    margin-top: 8px;
    background: $green;
    color: white;
    border: none;
    padding: 10px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
}
.bot-thinking {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    padding: 24px 0;
    letter-spacing: 0.03em;
}
</style>
