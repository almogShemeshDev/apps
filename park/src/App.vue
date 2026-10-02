<template>
    <div id="app" :dir="dir">
        <header class="top-bar">
            <button class="btn-ctrl btn-lang" @click="toggleLang">
                {{ lang === 'en' ? 'עב' : 'EN' }}
            </button>
        </header>

        <div class="setup">
            <h1 class="title">🎡 Park</h1>
            <p class="subtitle">{{ t('subtitle') }}</p>

            <div class="form">
                <p class="coming-soon">{{ t('comingSoon') }}</p>
                <button class="btn-start" disabled>{{ t('startGame') }}</button>
            </div>
        </div>

        <CreditsFooter />
    </div>
</template>

<script setup>
import CreditsFooter from './components/CreditsFooter.vue'
import { useLang } from './composables/useLang.js'

const { lang, t, dir, toggleLang } = useLang()
</script>

<style lang="scss" scoped>
@use './styles/colors' as *;

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: $bg-dark;
}

.top-bar {
    display: flex;
    gap: 6px;
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid $border;
    direction: ltr;
}

.btn-ctrl {
    background: rgba(0, 0, 0, 0.35);
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
}

.setup {
    flex: 1;
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
    align-items: center;
    gap: 16px;
    background: $bg-panel;
    border: 1px solid $border;
    padding: 28px 32px;
    border-radius: 16px;
    min-width: 300px;
}

.coming-soon {
    color: $text-dim;
    font-size: 0.85rem;
    text-align: center;
}

.btn-start {
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 13px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: not-allowed;
    letter-spacing: 0.04em;
    opacity: 0.6;
}
</style>
