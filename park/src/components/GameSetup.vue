<template>
    <div class="setup">
        <h1 class="title">🎡 Park</h1>
        <p class="subtitle">{{ t('subtitle') }}</p>

        <div class="form">
            <div v-for="i in 2" :key="i" class="field">
                <label>{{ t('playerLabel', i) }}</label>
                <input v-model="names[i - 1]" :placeholder="`Player ${i}`" />
            </div>

            <button class="btn-start" @click="start">{{ t('startGame') }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../composables/useLang.js'

const emit = defineEmits(['start'])
const { t } = useLang()

const names = ref(['Player 1', 'Player 2'])

function start() {
    const players = names.value.map((n, i) => n.trim() || `Player ${i + 1}`)
    emit('start', players)
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.setup {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
}

.title {
    font-size: 2.6rem;
    font-weight: 700;
    color: $gold;
    letter-spacing: 0.04em;
}

.subtitle {
    color: $text-dim;
    font-size: 0.9rem;
    text-align: center;
    max-width: 360px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: $bg-panel;
    border: 1px solid $border;
    padding: 28px 32px;
    border-radius: 16px;
    min-width: 300px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
        font-size: 0.78rem;
        color: $text-dim;
        text-transform: uppercase;
        letter-spacing: 0.07em;
    }

    input {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid $border;
        border-radius: 8px;
        padding: 9px 12px;
        color: $text;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.15s;

        &:focus {
            border-color: $gold;
        }
    }
}

.btn-start {
    margin-top: 8px;
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 13px;
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
