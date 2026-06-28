<template>
    <div class="overlay">
        <div class="modal">
            <h2>Trick Won by {{ winner?.name }}!</h2>
            <p class="picker-label">
                <strong>{{ currentPicker?.name }}</strong> — pick a bid card (or pass)
            </p>
            <p class="bid-hint">
                1 = bet 1 trick &nbsp;|&nbsp; 2 = bet 2 tricks &nbsp;|&nbsp; 🌳 = bet 0 or 3+ tricks
            </p>

            <div class="cards-row">
                <CardComponent
                    v-for="card in remainingCards"
                    :key="card.id"
                    :card="card"
                    :selectable="true"
                    :selected="selected?.id === card.id"
                    @select="selected = card"
                />
                <span v-if="!remainingCards.length" class="no-cards">No cards left to pick</span>
            </div>

            <div class="actions">
                <button class="btn confirm" :disabled="!selected" @click="confirm">
                    Confirm Bid
                </button>
                <button class="btn pass" @click="pass">Pass</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import CardComponent from './CardComponent.vue'

defineProps({
    winner: { type: Object, required: true },
    currentPicker: { type: Object, required: true },
    remainingCards: { type: Array, required: true },
})

const emit = defineEmits(['pick', 'pass'])
const selected = ref(null)

function confirm() {
    if (!selected.value) return
    emit('pick', selected.value)
    selected.value = null
}

function pass() {
    selected.value = null
    emit('pass')
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
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
}
h2 {
    margin: 0 0 8px;
    font-size: 1.3rem;
}
.picker-label {
    margin: 0 0 4px;
    font-size: 1rem;
}
.bid-hint {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 20px;
}
.cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 100px;
    align-items: center;
}
.no-cards {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.9rem;
}
.actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}
.btn {
    padding: 8px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
}
.confirm {
    background: $green;
    color: white;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
}
.pass {
    background: rgba(255, 255, 255, 0.1);
    color: $text;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
}
</style>
