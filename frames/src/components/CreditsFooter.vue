<template>
    <footer class="credits">{{ t('credits') }}</footer>
</template>

<script setup>
import { useLang } from '../composables/useLang.js'
const { t } = useLang()
</script>

<style lang="scss" scoped>
.credits {
    position: fixed;
    bottom: 12px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.2);
    pointer-events: none;
    letter-spacing: 0.03em;
}
</style>
