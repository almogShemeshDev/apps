<template>
    <div class="track-wrap">
        <div class="track">
            <div
                v-for="w in SHIPPING_WINDOWS"
                :key="w.level"
                class="node"
                :class="{ active: w.level === state.windowLevel }"
                :style="nodeStyle(w.level)"
            >
                <span class="level">{{ w.level }}</span>
                <span class="range" dir="ltr">{{ w.min }}-{{ w.max }}</span>
            </div>
            <div class="hub">
                📦
                <span class="hub-range" dir="ltr">{{ currentWindow.min }}–{{ currentWindow.max }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameState } from '../composables/useGameState.js'
import { SHIPPING_WINDOWS } from '../game/windows.js'

const { state, currentWindow } = useGameState()

function nodeStyle(level) {
    const angle = ((level - 1) / 5) * 2 * Math.PI - Math.PI / 2
    const radius = 70
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { transform: `translate(${x}px, ${y}px)` }
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.track-wrap {
    display: flex;
    justify-content: center;
    padding: 12px 0;
}

.track {
    position: relative;
    width: 180px;
    height: 180px;
}

.hub {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    height: 64px;
    margin: -32px 0 0 -32px;
    border-radius: 50%;
    background: $bg-panel;
    border: 2px dashed $border;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
}

.hub-range {
    font-size: 0.6rem;
    font-weight: 700;
    color: $text-dim;
}

.node {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 46px;
    height: 46px;
    margin: -23px 0 0 -23px;
    border-radius: 50%;
    background: $bg-panel;
    border: 2px solid $border;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    color: $text-dim;
    transition:
        box-shadow 0.4s,
        border-color 0.4s,
        background 0.4s;

    .level {
        font-weight: 700;
        font-size: 0.8rem;
    }

    &.active {
        background: $gold;
        border-color: $gold-light;
        color: $ink;
        box-shadow: 0 0 0 4px rgba(232, 162, 61, 0.25);

        .level,
        .range {
            color: $ink;
        }
    }
}
</style>
