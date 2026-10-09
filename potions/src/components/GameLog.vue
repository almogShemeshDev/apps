<template>
    <div class="game-log">
        <h3 class="log-title">{{ t('logTitle') }}</h3>
        <div ref="entriesEl" class="log-entries">
            <p v-if="!state.log.length" class="log-empty">{{ t('logEmpty') }}</p>
            <p
                v-for="entry in state.log"
                :key="entry.id"
                class="log-entry"
                :class="{ 'log-entry-round': entry.type === 'round-start' }"
            >
                {{ formatEntry(entry) }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { COLOR_META } from '../constants.js'
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

function icon(color) {
    return COLOR_META[color]?.icon ?? ''
}

function icons(colors) {
    return colors.map(icon).join(' ')
}

function formatEntry(entry) {
    switch (entry.type) {
        case 'round-start':
            return t('logRoundStart', entry.round, entry.playerName)
        case 'deal':
            return t('logDeal', entry.playerName)
        case 'pick':
            return t('logPick', entry.playerName, entry.letter, icons(entry.colors))
        case 'claim-final':
            return t('logClaimFinal', entry.playerName, icons(entry.colors))
        case 'trash-three':
            return t('logTrashThree', entry.playerName, icon(entry.color))
        case 'trash-four':
            return t('logTrashFour', entry.playerName, icon(entry.color))
        case 'blue-draw':
            return t('logBlueDraw', entry.playerName, icon(entry.color))
        case 'blue-draw-flip':
            return t('logBlueDrawFlip', entry.playerName, icon(entry.color))
        case 'blue-return':
            return t('logBlueReturn', entry.playerName, icon(entry.color))
        case 'red':
            return t('logRed', entry.playerName, icon(entry.color))
        case 'red-flip':
            return t('logRedFlip', entry.playerName, icon(entry.color))
        case 'yellow':
            return t('logYellow', entry.playerName, entry.count, icon(entry.color))
        case 'yellow-flip':
            return t('logYellowFlip', entry.playerName, entry.count, icon(entry.color))
        case 'green':
            return t('logGreen', entry.playerName, icon(entry.color))
        case 'green-flip':
            return t('logGreenFlip', entry.playerName, icon(entry.color))
        case 'white-convert-trash':
            return t('logWhiteConvertTrash', entry.playerName, icon(entry.color))
        case 'white-convert-blue':
            return t('logWhiteConvertBlue', entry.playerName, icon(entry.color))
        case 'white-convert-blue-flip':
            return t('logWhiteConvertBlueFlip', entry.playerName, icon(entry.color))
        case 'white-convert-yellow':
            return t('logWhiteConvertYellow', entry.playerName, entry.count, icon(entry.color))
        case 'white-convert-yellow-flip':
            return t('logWhiteConvertYellowFlip', entry.playerName, entry.count, icon(entry.color))
        case 'white-convert-red':
            return t('logWhiteConvertRed', entry.playerName, icon(entry.color))
        case 'white-convert-red-flip':
            return t('logWhiteConvertRedFlip', entry.playerName, icon(entry.color))
        case 'white-convert-green':
            return t('logWhiteConvertGreen', entry.playerName, icon(entry.color))
        case 'white-convert-green-flip':
            return t('logWhiteConvertGreenFlip', entry.playerName, icon(entry.color))
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
    max-height: 560px;
}

.log-title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
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

.log-entry-round {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid $border;
    color: $gold;
    font-weight: 700;
}
</style>
