<template>
    <div class="panel" :class="{ active: isActive }">
        <div class="panel-header">
            <span class="name">{{ player.name }}</span>
            <span v-if="isActive" class="badge">{{ t('activeBadge') }}</span>
        </div>

        <div class="stats">
            <span>💰 {{ t('goldLabel') }}: {{ player.gold }}</span>
            <span>🏆 {{ t('vpLabel') }}: {{ player.vp }}</span>
            <span v-if="player.negativeVp">⚠️ {{ t('negativeVpLabel') }}: -{{ player.negativeVp }}</span>
            <span>🎒 {{ t('bagLabel') }}: {{ player.bag.length }}</span>
            <span>🗑️ {{ t('discardLabel') }}: {{ player.discard.length }}</span>
            <span v-if="player.trashedCount">❌ {{ t('trashedLabel') }}: {{ player.trashedCount }}</span>
        </div>

        <div v-if="isActive && pendingChoice" class="pending-banner">
            {{ pendingChoice.kind === 'discard'
                ? t('pendingChoiceDiscard', pendingChoice.remaining)
                : t('pendingChoiceTrash', pendingChoice.remaining) }}
        </div>

        <div class="drawn">
            <span class="drawn-label">{{ t('drawnLabel') }}</span>
            <div class="drawn-pills">
                <DiscPill
                    v-for="(disc, i) in player.drawn"
                    :key="i"
                    :type="disc"
                    :selectable="isActive"
                    :selected="isActive && !pendingChoice && selectedIndices.includes(i)"
                    @toggle="$emit('toggle-disc', i)"
                />
                <span v-if="!player.drawn.length" class="none">—</span>
            </div>
        </div>

        <div class="tableau">
            <span class="tableau-label">{{ t('tableauLabel') }}</span>
            <div class="tableau-cards">
                <CardTile
                    v-for="card in player.tableau"
                    :key="card.uid"
                    mode="tableau"
                    :card-id="card.cardId"
                    :uses-this-turn="card.usesThisTurn"
                    :can-activate-option="(optionId) => isActive && canActivateOption(card, optionId)"
                    @activate="(optionId) => $emit('activate-card', card.uid, optionId)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import DiscPill from './DiscPill.vue'
import CardTile from './CardTile.vue'
import { useLang } from '../composables/useLang.js'

defineProps({
    player: { type: Object, required: true },
    isActive: { type: Boolean, default: false },
    selectedIndices: { type: Array, default: () => [] },
    pendingChoice: { type: Object, default: null },
    canActivateOption: { type: Function, required: true },
})
defineEmits(['activate-card', 'toggle-disc'])

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 16px;
    flex: 1;
    min-width: 280px;

    &.active {
        border-color: $gold;
        box-shadow: 0 0 0 1px $gold;
    }
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.name {
    font-weight: 700;
    font-size: 1.05rem;
    color: $text;
}

.badge {
    background: $gold;
    color: $bg-dark;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.8rem;
    color: $text-dim;
}

.pending-banner {
    background: rgba(255, 182, 39, 0.15);
    border: 1px solid $gold;
    color: $gold;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
}

.drawn-label,
.tableau-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: block;
    margin-bottom: 6px;
}

.drawn-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    min-height: 26px;
}

.none {
    color: $text-dim;
    font-size: 0.8rem;
}

.tableau-cards {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
