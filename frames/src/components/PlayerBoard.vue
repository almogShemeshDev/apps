<template>
    <div class="board" :class="{ 'is-active': isActive, dimmed: !isActive }">
        <div class="board-header">
            <div class="player-name">{{ player.name }}</div>
            <div class="time-badge">⏱ {{ t('timeTokens', player.time) }}</div>
        </div>

        <div class="tracks">
            <div v-for="(key, i) in trackKeys" :key="i" class="track" :style="{ '--c': TRACKS[key].color }">
                <span class="track-icon">{{ TRACKS[key].icon }}</span>
                <span class="track-name">{{ t('trackName', key) }}</span>
                <span class="track-level">{{ player.tracks[key] }}</span>
            </div>
        </div>

        <div class="bag-row">
            <span class="bag-label">{{ t('bagLabel') }}:</span>
            <span class="cube white">{{ t('whiteCubes', player.bag.white) }}</span>
            <span class="cube black">{{ t('blackCubes', player.bag.black) }}</span>
        </div>

        <div class="film-strip">
            <span class="strip-label">{{ t('filmStripLabel') }} ({{ player.filmStrip.length }})</span>
            <div class="strip-frames">
                <div
                    v-for="photo in player.filmStrip"
                    :key="photo.id"
                    class="frame"
                    :style="{ '--c': CATEGORIES[photo.category].color }"
                    :class="{ developed: photo.developed === true, burned: photo.developed === false }"
                >
                    {{ CATEGORIES[photo.category].icon }}
                </div>
                <span v-if="!player.filmStrip.length" class="no-frames">—</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CATEGORIES, TRACKS } from '../constants.js'
import { useLang } from '../composables/useLang.js'

defineProps({
    player: { type: Object, required: true },
    isActive: { type: Boolean, default: false },
})

const { t } = useLang()
const trackKeys = ['creativity', 'equipment', 'knowledge', 'darkroom']
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.board {
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition:
        border-color 0.2s,
        opacity 0.2s;

    &.is-active {
        border-color: $amber;
    }

    &.dimmed {
        opacity: 0.55;
    }
}

.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.player-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: $text;
}

.time-badge {
    font-size: 0.78rem;
    color: $amber-light;
    font-weight: 600;
}

.tracks {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.track {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--c);
    border-radius: 20px;
    padding: 2px 8px;
    font-size: 0.72rem;
}

.track-name {
    color: $text-dim;
}

.track-level {
    font-weight: 700;
    color: var(--c);
}

.bag-row {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    align-items: center;
}

.bag-label {
    color: $text-dim;
}

.cube.white {
    color: $white-cube;
}

.cube.black {
    color: $text-dim;
}

.film-strip {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.strip-label {
    font-size: 0.7rem;
    color: $text-dim;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.strip-frames {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.frame {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 2px solid var(--c);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.04);

    &.developed {
        background: rgba(255, 255, 255, 0.12);
    }

    &.burned {
        opacity: 0.3;
        filter: grayscale(1);
    }
}

.no-frames {
    color: $text-dim;
    font-size: 0.8rem;
}
</style>
