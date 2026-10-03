<template>
    <div class="strip">
        <span class="strip-label">{{ t('otherPlayers') }}</span>
        <div class="strip-items">
            <div v-for="p in players" :key="p.name" class="item">
                <span class="name">{{ p.name }}</span>
                <span>🏆 {{ p.vp }}</span>
                <span>🗑️ {{ p.discard.length }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLang } from '../composables/useLang.js'

defineProps({
    players: { type: Array, required: true },
})

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.strip {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.strip-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.strip-items {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.78rem;
    color: $text-dim;
}

.name {
    font-weight: 700;
    color: $text;
}
</style>
