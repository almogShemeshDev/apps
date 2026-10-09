<template>
    <div class="picking-panel">
        <h2 class="panel-title">
            {{
                state.phase === 'dealer-final'
                    ? t('dealerFinalTitle', turnPlayer.name)
                    : t('pickingTitle', turnPlayer.name)
            }}
        </h2>
        <div v-if="turnPlayer.isBot" class="bot-thinking">{{ t('botThinking', turnPlayer.name) }}</div>

        <p v-else class="hint">{{ greenPicking ? t('greenPickPrompt') : t('pickingHint') }}</p>

        <div class="groups">
            <div v-for="(group, gi) in state.groups" :key="group.id" class="group">
                <span class="group-label">{{ t('groupLabel', letterFor(gi)) }}</span>
                <div class="card-row">
                    <PotionCard
                        v-for="card in group.cards"
                        :key="card.id"
                        :color="card.color"
                        :clickable="greenPicking"
                        @click="greenPicking && onGreenPick(group.id, card.id)"
                    />
                    <span v-if="!group.cards.length" class="none">{{ t('emptyGroup') }}</span>
                </div>
                <template v-if="!turnPlayer.isBot">
                    <button
                        v-if="!greenPicking && state.phase === 'picking' && canPickGroup(turnPlayerIndex, group.id)"
                        class="btn-pick"
                        @click="pickGroup(turnPlayerIndex, group.id)"
                    >
                        {{ t('pickGroupBtn') }}
                    </button>
                    <button
                        v-if="!greenPicking && state.phase === 'dealer-final' && canClaimFinalGroup(turnPlayerIndex)"
                        class="btn-pick"
                        @click="claimFinalGroup(turnPlayerIndex)"
                    >
                        {{ t('claimFinalBtn') }}
                    </button>
                </template>
            </div>
        </div>

        <template v-if="!turnPlayer.isBot">
            <button v-if="greenPicking" class="btn-cancel" @click="greenPicking = false">{{ t('cancel') }}</button>

            <AbilityPanel
                v-else
                :key="'picker-' + turnPlayerIndex + '-' + state.round + '-' + state.pickPointer"
                :player-index="turnPlayerIndex"
                @green-start="onGreenStart"
            />

            <button
                v-if="state.phase === 'picking' && canConfirmPickerTurn(turnPlayerIndex)"
                class="btn-confirm"
                @click="confirmPickerTurn(turnPlayerIndex)"
            >
                {{ t('confirmTurnBtn') }}
            </button>
            <button v-if="state.phase === 'dealer-final' && canEndRound(turnPlayerIndex)" class="btn-confirm" @click="endRound">
                {{ t('endRoundBtn') }}
            </button>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import PotionCard from './PotionCard.vue'
import AbilityPanel from './AbilityPanel.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const {
    state,
    turnPlayerIndex,
    turnPlayer,
    canPickGroup,
    pickGroup,
    canConfirmPickerTurn,
    confirmPickerTurn,
    canClaimFinalGroup,
    claimFinalGroup,
    canEndRound,
    endRound,
    useGreenAbility,
    useWhiteConversionGreen,
} = useGameState()
const { t } = useLang()

const greenPicking = ref(false)
// 'normal' | 'flip' | 'white'
const greenMode = ref('normal')

function letterFor(i) {
    return String.fromCharCode(65 + i)
}

function onGreenStart(mode) {
    greenPicking.value = true
    greenMode.value = mode
}

function onGreenPick(groupId, cardId) {
    if (greenMode.value === 'white') {
        useWhiteConversionGreen(turnPlayerIndex.value, groupId, cardId)
    } else {
        useGreenAbility(turnPlayerIndex.value, groupId, cardId, greenMode.value === 'flip')
    }
    greenPicking.value = false
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.picking-panel {
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
    padding: 4px 0;
}

.group-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: block;
    margin-bottom: 6px;
}

.groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 12px;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border;
    border-radius: 10px;
    padding: 10px;
}

.card-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    min-height: 122px;
    align-items: center;
}

.none {
    color: $text-dim;
    font-size: 0.8rem;
}

.btn-pick,
.btn-confirm {
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: $gold-light;
    }
}

.btn-confirm {
    align-self: center;
    padding: 10px 22px;
}

.btn-cancel {
    align-self: center;
    background: transparent;
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 7px 16px;
    font-size: 0.82rem;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
