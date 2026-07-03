<template>
    <div class="game-board">
        <div class="opponents">
            <PlayerHand
                v-for="player in opponents"
                :key="player.id"
                :player="player"
                :is-active="activePlayer() === player.id && !player.isBot"
                :is-bot="player.isBot"
                :is-turn="activePlayer() === player.id"
                :lead-suit="leadSuit"
                @play="(card) => playCard(player.id, card)"
            />
        </div>

        <div class="center">
            <TrickArea :trick="state.currentTrick" />

            <!-- Trick resolved banner — kept non-blocking so the winning card stays visible -->
            <div v-if="state.phase === 'trick-resolved'" class="trick-result-banner">
                <p class="winner-name">
                    {{ t('wonTrick', getPlayer(state.currentTrick.winnerId)?.name) }}
                </p>
                <button class="btn-next" @click="nextTrick">{{ t('nextTrick') }}</button>
            </div>
        </div>

        <PlayerHand
            :player="state.players[0]"
            :is-active="activePlayer() === 0"
            :lead-suit="leadSuit"
            @play="(card) => playCard(0, card)"
        />

        <!-- Replace bid modal — only for human players; bots auto-replace via useBotAI -->
        <ReplaceBidModal
            v-if="state.phase === 'replacing-bid' && !getPlayer(state.replacingBidPlayerId)?.isBot"
            :player="getPlayer(state.replacingBidPlayerId)"
        />

        <CreditsFooter />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerHand from './PlayerHand.vue'
import TrickArea from './TrickArea.vue'
import ReplaceBidModal from './ReplaceBidModal.vue'
import CreditsFooter from './CreditsFooter.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, activePlayer, getPlayer, playCard, nextTrick } = useGameState()
const { t } = useLang()

const opponents = computed(() => state.players.filter((p) => p.id !== 0))
const leadSuit = computed(() => state.currentTrick.plays[0]?.card.suit ?? null)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    min-height: 100vh;
    background: $bg-dark;
}
.opponents {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
}
.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}
.trick-result-banner {
    background: $bg-deep;
    border: 2px solid rgba(246, 224, 94, 0.4);
    border-radius: 16px;
    padding: 16px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.winner-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: $gold;
    margin: 0;
}
.btn-next {
    background: $green;
    color: white;
    border: none;
    padding: 10px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
}
</style>
