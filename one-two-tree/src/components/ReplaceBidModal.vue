<template>
    <div class="overlay">
        <div class="modal">
            <h2>{{ t('playedBidCard') }}</h2>
            <p class="sub">{{ t('pickNewBidSuffix', player.name) }}</p>
            <p class="hint">{{ t('bidHintShort') }}</p>

            <div class="cards">
                <CardComponent
                    v-for="card in player.hand"
                    :key="card.id"
                    :card="card"
                    :selectable="true"
                    :selected="selected?.id === card.id"
                    @select="selected = card"
                />
            </div>

            <button class="btn-confirm" :disabled="!selected" @click="confirm">
                {{ t('confirmNewBid') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import CardComponent from './CardComponent.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    player: { type: Object, required: true },
})

const { replaceBid } = useGameState()
const { t } = useLang()
const selected = ref(null)

function confirm() {
    if (!selected.value) return
    replaceBid(props.player.id, selected.value)
    selected.value = null
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}
.modal {
    background: $bg-deep;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 28px 32px;
    text-align: center;
    max-width: 560px;
    width: 90%;
    color: $text;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
h2 {
    margin: 0;
    font-size: 1.3rem;
}
.sub {
    margin: 0;
    font-size: 1rem;
}
.hint {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
}
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    min-height: 100px;
    align-items: center;
}
.btn-confirm {
    background: $green;
    color: white;
    border: none;
    padding: 8px 28px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
}
</style>
