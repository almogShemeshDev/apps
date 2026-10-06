<template>
    <div class="ability-panel">
        <div class="hand-row">
            <span class="hand-label">{{ t('handLabel') }} · {{ t('cardsLeftLabel', player.hand.length) }}</span>
            <div class="hand-chips">
                <span
                    v-for="c in handCounts(player.hand)"
                    :key="c.color"
                    class="chip"
                    :style="{ background: COLOR_META[c.color].hex }"
                >
                    {{ COLOR_META[c.color].icon }} {{ c.count }}
                </span>
                <span v-if="!player.hand.length" class="none">—</span>
            </div>
        </div>

        <div v-if="pendingBlue" class="flow-box">
            <p class="flow-prompt">{{ t('blueReturnPrompt') }}</p>
            <div class="flow-choices">
                <button
                    v-for="c in blueReturnCandidates(playerIndex)"
                    :key="c"
                    class="choice-chip"
                    :style="{ background: COLOR_META[c].hex }"
                    @click="resolveBlueReturn(playerIndex, c)"
                >
                    {{ COLOR_META[c].icon }}
                </button>
            </div>
        </div>

        <template v-else>
            <div v-if="hasAnyAbility" class="abilities-label">{{ t('abilitiesLabel') }}</div>
            <div class="ability-buttons">
                <button
                    v-for="color in trashableColors"
                    :key="'t4-' + color"
                    class="ability-btn"
                    @click="trashFour(playerIndex, color)"
                >
                    {{ t('trashFourBtn', color) }}
                </button>

                <button v-if="canUseBlueAbility(playerIndex)" class="ability-btn" @click="useBlueAbilityDraw(playerIndex)">
                    {{ t('blueAbilityBtn') }}
                </button>

                <button
                    v-if="canUseRedAbility(playerIndex) && !redChoosing"
                    class="ability-btn"
                    @click="redChoosing = true"
                >
                    {{ t('redAbilityBtn') }}
                </button>

                <button
                    v-if="canUseYellowAbility(playerIndex) && !yellowChoosing"
                    class="ability-btn"
                    @click="onYellowClick"
                >
                    {{ t('yellowAbilityBtn') }}
                </button>

                <button v-if="canUseGreenAbility(playerIndex)" class="ability-btn" @click="$emit('green-start')">
                    {{ t('greenAbilityBtn') }}
                </button>

                <button
                    v-if="canUseWhiteAbility(playerIndex) && !whiteChoosing"
                    class="ability-btn"
                    @click="whiteChoosing = true"
                >
                    {{ t('whiteAbilityBtn') }}
                </button>
            </div>

            <div v-if="redChoosing" class="flow-box">
                <p class="flow-prompt">{{ t('redChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in redAbilityTargets(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onRedChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="redChoosing = false">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="yellowChoosing" class="flow-box">
                <p class="flow-prompt">{{ t('yellowChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in yellowTargetCandidates(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onYellowChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="yellowChoosing = false">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="whiteChoosing" class="flow-box">
                <p class="flow-prompt">{{ t('whiteChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in whiteColorOptions(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onWhiteChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="whiteChoosing = false">{{ t('cancel') }}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { COLORS, COLOR_META, handCounts } from '../constants.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    playerIndex: { type: Number, required: true },
})
defineEmits(['green-start'])

const {
    state,
    canTrashFour,
    trashFour,
    canUseBlueAbility,
    useBlueAbilityDraw,
    blueReturnCandidates,
    resolveBlueReturn,
    canUseRedAbility,
    redAbilityTargets,
    useRedAbility,
    canUseYellowAbility,
    yellowTargetCandidates,
    useYellowAbility,
    canUseGreenAbility,
    canUseWhiteAbility,
    whiteColorOptions,
    useWhiteAbility,
} = useGameState()
const { t } = useLang()

const player = computed(() => state.players[props.playerIndex])
const pendingBlue = computed(
    () => state.pendingBlueReturn && state.pendingBlueReturn.playerIndex === props.playerIndex
)
const trashableColors = computed(() => COLORS.filter((c) => canTrashFour(props.playerIndex, c)))
const hasAnyAbility = computed(
    () =>
        trashableColors.value.length > 0 ||
        canUseBlueAbility(props.playerIndex) ||
        canUseRedAbility(props.playerIndex) ||
        canUseYellowAbility(props.playerIndex) ||
        canUseGreenAbility(props.playerIndex) ||
        canUseWhiteAbility(props.playerIndex)
)

const redChoosing = ref(false)
const yellowChoosing = ref(false)
const whiteChoosing = ref(false)

function onRedChoose(color) {
    useRedAbility(props.playerIndex, color)
    redChoosing.value = false
}

function onYellowClick() {
    const candidates = yellowTargetCandidates(props.playerIndex)
    if (candidates.length === 1) {
        useYellowAbility(props.playerIndex, candidates[0])
    } else {
        yellowChoosing.value = true
    }
}

function onYellowChoose(color) {
    useYellowAbility(props.playerIndex, color)
    yellowChoosing.value = false
}

function onWhiteChoose(color) {
    useWhiteAbility(props.playerIndex, color)
    whiteChoosing.value = false
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.ability-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border;
    border-radius: 12px;
    padding: 12px;
}

.hand-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: block;
    margin-bottom: 6px;
}

.hand-chips,
.flow-choices,
.ability-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 0.78rem;
    font-weight: 700;
    color: $bg-dark;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

.none {
    color: $text-dim;
    font-size: 0.8rem;
}

.abilities-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.ability-btn {
    background: $bg-dark;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}

.flow-box {
    background: rgba(178, 101, 255, 0.1);
    border: 1px solid $gold;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.flow-prompt {
    font-size: 0.8rem;
    color: $gold;
    font-weight: 700;
}

.choice-chip {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s;

    &:hover {
        transform: scale(1.1);
    }
}

.choice-cancel {
    background: transparent;
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 0.78rem;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
