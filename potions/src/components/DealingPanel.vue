<template>
    <div class="dealing-panel">
        <h2 class="panel-title">{{ t('dealingTitle', dealer.name) }}</h2>

        <div v-if="dealer.isBot" class="bot-thinking">{{ t('botThinking', dealer.name) }}</div>

        <template v-else>
        <p class="hint">{{ t('dealingHint') }}</p>

        <div class="pool">
            <span class="pool-label">{{ t('poolLabel') }}</span>
            <div class="card-row" :class="{ armed: !!selected }" @click.self="performMove(null)" @dragover.prevent @drop="onDropToPool">
                <PotionCard
                    v-for="card in state.pool"
                    :key="card.id"
                    :color="card.color"
                    draggable
                    clickable
                    :selected="selected?.cardId === card.id"
                    @click="onCardClick(card.id, null)"
                    @dragstart="(e) => onDragStart(e, card.id, null)"
                />
                <span v-if="!state.pool.length" class="none">—</span>
            </div>
        </div>

        <div class="groups">
            <div v-for="(group, gi) in state.groups" :key="group.id" class="group">
                <span class="group-label">{{ t('groupLabel', letterFor(gi)) }}</span>
                <div
                    class="card-row"
                    :class="{ armed: !!selected }"
                    @click.self="performMove(group.id)"
                    @dragover.prevent
                    @drop="onDropToGroup(group.id)"
                >
                    <PotionCard
                        v-for="card in group.cards"
                        :key="card.id"
                        :color="card.color"
                        draggable
                        clickable
                        :selected="selected?.cardId === card.id"
                        @click="onCardClick(card.id, group.id)"
                        @dragstart="(e) => onDragStart(e, card.id, group.id)"
                    />
                    <span v-if="!group.cards.length" class="none">{{ t('emptyGroup') }}</span>
                </div>
            </div>
        </div>

        <button class="btn-confirm" :disabled="!canConfirmGroups()" @click="confirmGroups">
            {{ t('confirmGroupsBtn') }}
        </button>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PotionCard from './PotionCard.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const {
    state,
    assignPoolCardToGroup,
    returnGroupCardToPool,
    moveGroupCardToGroup,
    canConfirmGroups,
    confirmGroups,
} = useGameState()
const { t } = useLang()

const dealer = computed(() => state.players[state.dealerIndex])
const selected = ref(null) // { cardId, groupId } — groupId null means the card is in the pool

function letterFor(i) {
    return String.fromCharCode(65 + i)
}

function onCardClick(cardId, groupId) {
    if (selected.value && selected.value.cardId === cardId) {
        selected.value = null
        return
    }
    selected.value = { cardId, groupId }
}

function onDragStart(e, cardId, groupId) {
    selected.value = { cardId, groupId }
    e.dataTransfer.setData('text/plain', String(cardId))
    e.dataTransfer.effectAllowed = 'move'
}

function performMove(targetGroupId) {
    if (!selected.value) return
    const { cardId, groupId } = selected.value
    if (groupId === null) {
        if (targetGroupId !== null) assignPoolCardToGroup(cardId, targetGroupId)
    } else if (targetGroupId === null) {
        returnGroupCardToPool(groupId, cardId)
    } else if (targetGroupId !== groupId) {
        moveGroupCardToGroup(groupId, cardId, targetGroupId)
    }
    selected.value = null
}

function onDropToGroup(groupId) {
    performMove(groupId)
}

function onDropToPool() {
    performMove(null)
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.dealing-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 720px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 18px;
}

.panel-title {
    font-size: 1.1rem;
    color: $gold;
    text-align: center;
}

.hint {
    font-size: 0.78rem;
    color: $text-dim;
    text-align: center;
}

.bot-thinking {
    font-size: 0.9rem;
    color: $text-dim;
    font-style: italic;
    text-align: center;
    padding: 12px 0;
}

.pool-label,
.group-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: block;
    margin-bottom: 6px;
}

.card-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    min-height: 46px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed $border;
    border-radius: 10px;
    padding: 8px;
    transition: border-color 0.15s;

    &.armed {
        border-color: $gold;
    }
}

.groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
}

.group {
    display: flex;
    flex-direction: column;
}

.none {
    color: $text-dim;
    font-size: 0.8rem;
}

.btn-confirm {
    align-self: center;
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: $gold-light;
    }

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
}
</style>
