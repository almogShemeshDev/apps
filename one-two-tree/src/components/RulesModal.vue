<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="btn-close" @click="$emit('close')">✕</button>
      <h2>How to Play</h2>

      <section>
        <h3>The Deck</h3>
        <p>56 cards in 4 suits (Red, Blue, Green, Yellow):</p>
        <ul>
          <li>3 Trees per suit (12 total)</li>
          <li>6 Ones per suit (24 total)</li>
          <li>5 Twos per suit (20 total)</li>
        </ul>
      </section>

      <section>
        <h3>Setup</h3>
        <p>Cards are dealt evenly based on player count:</p>
        <ul>
          <li>3 players — 13 cards each</li>
          <li>4 players — 14 cards each</li>
          <li>5 players — 10 cards each</li>
        </ul>
        <p>Before play begins, each player secretly picks <strong>1 card from their hand</strong> as their bid. The bid stays face-up in front of them all game.</p>
      </section>

      <section>
        <h3>Playing a Trick</h3>
        <p>The lead player plays any card. Going clockwise, each player must <strong>follow suit</strong> (match the lead card's color) if they can. If they can't, they may play any card.</p>
      </section>

      <section>
        <h3>Winning a Trick</h3>
        <ul>
          <li><strong>No Trees played:</strong> highest on-suit card wins (2 beats 1).</li>
          <li><strong>Exactly 1 Tree played:</strong> that Tree wins, regardless of suit.</li>
          <li><strong>2 or more Trees played:</strong> all Trees are worth 0 — highest on-suit non-Tree wins.</li>
          <li>Off-suit cards (that aren't Trees) can never win.</li>
        </ul>
      </section>

      <section>
        <h3>Scoring</h3>
        <p>After all hand cards are played (bid cards stay), count up:</p>
        <ul>
          <li><strong>1 point</strong> per trick won.</li>
          <li><strong>+5 bonus</strong> if your trick count matches your bid:</li>
          <li class="indent">Bid 1 → must win exactly 1 trick.</li>
          <li class="indent">Bid 2 → must win exactly 2 tricks.</li>
          <li class="indent">Bid 🌳 → must win exactly 0 or exactly 3 tricks.</li>
        </ul>
        <p>Highest total wins!</p>
      </section>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal {
  background: #1a3a2a;
  border: 2px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 32px;
  max-width: 540px;
  width: 100%;
  color: #e8f5e9;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: #e8f5e9;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-close:hover { background: rgba(255,255,255,0.18); }
h2 {
  font-size: 1.4rem;
  margin: 0;
  padding-right: 36px;
}
section { display: flex; flex-direction: column; gap: 6px; }
h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #68d391;
  margin: 0;
}
p { margin: 0; font-size: 0.92rem; line-height: 1.5; }
ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
li { font-size: 0.92rem; line-height: 1.5; }
li.indent { list-style: none; padding-left: 12px; color: rgba(255,255,255,0.7); }
</style>
