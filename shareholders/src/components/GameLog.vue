<template>
    <div class="game-log">
        <h3 class="log-title">{{ t('logTitle') }}</h3>
        <div ref="entriesEl" class="log-entries">
            <p v-if="!state.log.length" class="log-empty">{{ t('logEmpty') }}</p>
            <p
                v-for="entry in state.log"
                :key="entry.id"
                class="log-entry"
                :class="{ 'log-entry-turn': entry.type === 'round-start' }"
            >
                {{ formatEntry(entry) }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { COMPANIES } from '../constants.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state } = useGameState()
const { t } = useLang()

const entriesEl = ref(null)

watch(
    () => state.log.length,
    () => {
        nextTick(() => {
            if (entriesEl.value) entriesEl.value.scrollTop = entriesEl.value.scrollHeight
        })
    }
)

function formatEntry(entry) {
    switch (entry.type) {
        case 'round-start':
            return t('logRoundStart', entry.round, entry.playerName)
        case 'pick':
            return t(
                'logPick',
                entry.playerName,
                COMPANIES[entry.company]?.icon ?? '',
                t(entry.kind === 'share' ? 'shareLabel' : 'trainLabel')
            )
        case 'discard':
            return t('logDiscard', entry.count)
        case 'game-over':
            return t('logGameOver')
        default:
            return ''
    }
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-log {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 14px;
    width: 100%;
    max-height: 280px;
}

.log-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
}

.log-entries {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    min-height: 0;
}

.log-empty {
    color: $text-dim;
    font-size: 0.82rem;
}

.log-entry {
    font-size: 0.8rem;
    color: $text;
    line-height: 1.4;
}

.log-entry-turn {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid $border;
    color: $gold;
    font-weight: 700;
}
</style>
