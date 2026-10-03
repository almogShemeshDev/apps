<template>
    <footer class="credits">{{ t('credits') }}</footer>
</template>

<script setup>
import { useLang } from '../composables/useLang.js'
const { t } = useLang()
</script>

<style lang="scss" scoped>
.credits {
    margin-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.03em;
}
</style>
