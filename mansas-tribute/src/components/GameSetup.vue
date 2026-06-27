<template>
    <div class="setup">
        <h1 class="title">Mansa's Tribute</h1>
        <p class="subtitle">{{ t('subtitle') }}</p>

        <div class="form">
            <div class="field">
                <label>{{ t('numPlayers') }}</label>
                <div class="count-picker">
                    <button
                        v-for="n in [2, 3, 4, 5]"
                        :key="n"
                        :class="{ active: playerCount === n }"
                        @click="playerCount = n"
                    >
                        {{ n }}
                    </button>
                </div>
            </div>

            <div v-for="i in playerCount" :key="i" class="field">
                <label>{{ t('playerLabel', i) }}</label>
                <div class="player-row">
                    <input
                        v-model="names[i - 1]"
                        :placeholder="i === 1 ? 'Player 1' : `Bot ${i}`"
                    />
                    <div v-if="i > 1" class="bot-toggle">
                        <button :class="{ active: !bots[i - 1] }" @click="bots[i - 1] = false">
                            {{ t('human') }}
                        </button>
                        <button :class="{ active: bots[i - 1] }" @click="bots[i - 1] = true">
                            {{ t('bot') }}
                        </button>
                    </div>
                </div>
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

const playerCount = ref(3)
const names = ref(['Player 1', 'Bot 2', 'Bot 3', 'Bot 4', 'Bot 5'])
const bots = ref([false, true, true, true, true])

function start() {
    const players = names.value.slice(0, playerCount.value).map((n, i) => ({
        name: n.trim() || (i === 0 ? 'Player 1' : `Bot ${i + 1}`),
        isBot: i === 0 ? false : bots.value[i],
    }))
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
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: $surface;
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
}

.player-row {
    display: flex;
    gap: 8px;
    align-items: center;

    input {
        flex: 1;
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

.bot-toggle {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid $border;
    flex-shrink: 0;

    button {
        padding: 8px 10px;
        border: none;
        background: transparent;
        color: $text-dim;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition:
            background 0.15s,
            color 0.15s;

        &.active {
            background: $gold;
            color: $bg-dark;
        }

        &:not(.active):hover {
            color: $text;
        }
    }
}

.count-picker {
    display: flex;
    gap: 8px;

    button {
        width: 46px;
        height: 46px;
        border-radius: 8px;
        border: 2px solid $border;
        background: transparent;
        color: $text;
        font-size: 1.05rem;
        font-weight: 700;
        cursor: pointer;
        transition:
            background 0.15s,
            border-color 0.15s;

        &.active {
            background: $gold;
            border-color: $gold;
            color: $bg-dark;
        }

        &:hover:not(.active) {
            border-color: rgba(255, 255, 255, 0.3);
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
