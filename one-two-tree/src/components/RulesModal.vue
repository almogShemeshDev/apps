<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
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
                        <li>3 players - 13 cards each</li>
                        <li>4 players - 14 cards each</li>
                        <li>5 players - 10 cards each</li>
                    </ul>
                    <p>
                        Before play begins, each player picks
                        <strong>1 card from their hand</strong> as their bid. The bid is visible to
                        all players and represents the target they're aiming for.
                    </p>
                </section>

                <section>
                    <h3>Playing a Trick</h3>
                    <p>
                        The lead player plays any card from their hand
                        <strong>or their bid card</strong>. Going clockwise, each player must
                        <strong>follow suit</strong> (match the lead card's color) if they can. If
                        they can't, they may play any card.
                    </p>
                    <p>
                        If you play your bid card, you immediately pick a replacement card from your
                        hand to become the new bid.
                    </p>
                </section>

                <section>
                    <h3>Winning a Trick</h3>
                    <ul>
                        <li>
                            <strong>No Trees played:</strong> highest on-suit card wins (2 beats 1).
                        </li>
                        <li>
                            <strong>Exactly 1 Tree played:</strong> that Tree wins, regardless of
                            suit.
                        </li>
                        <li>
                            <strong>2 or more Trees played:</strong> all Trees are worth 0 - highest
                            on-suit non-Tree wins.
                        </li>
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
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>החפיסה</h3>
                    <p>56 קלפים ב-4 צבעים (אדום, כחול, ירוק, צהוב):</p>
                    <ul>
                        <li>3 עצים לכל צבע (12 בסך הכל)</li>
                        <li>6 קלפי "1" לכל צבע (24 בסך הכל)</li>
                        <li>5 קלפי "2" לכל צבע (20 בסך הכל)</li>
                    </ul>
                </section>

                <section>
                    <h3>הכנה</h3>
                    <p>הקלפים מחולקים באופן שווה לפי מספר השחקנים:</p>
                    <ul>
                        <li>3 שחקנים - 13 קלפים לכל אחד</li>
                        <li>4 שחקנים - 14 קלפים לכל אחד</li>
                        <li>5 שחקנים - 10 קלפים לכל אחד</li>
                    </ul>
                    <p>
                        לפני תחילת המשחק, כל שחקן בוחר <strong>קלף אחד מידו</strong> כהימור שלו.
                        ההימור גלוי לכולם ויתן בונוס ניקוד בסוף המשחק.
                    </p>
                </section>

                <section>
                    <h3>שחקנ טריק</h3>
                    <p>
                        השחקן המתחיל מניח כל קלף מידו <strong>או את קלף ההימור שלו</strong>. בכיוון
                        השעון, כל שחקן חייב <strong>לעקוב אחרי הצבע</strong> (לשחק קלף באותו צבע)
                        אם ביכולתו. אם אינו יכול, הוא רשאי לשחק כל קלף.
                    </p>
                    <p>אם שיחקת את קלף ההימור שלך, עליך לבחור מיד קלף חלופי מידך כהימור החדש.</p>
                </section>

                <section>
                    <h3>ניצחון בטריק</h3>
                    <ul>
                        <li><strong>ללא עצים:</strong> הקלף הגבוה באותה צבע מנצח (2 מנצח על 1).</li>
                        <li><strong>עץ אחד בדיוק:</strong> אותו עץ מנצח, ללא קשר לצבע.</li>
                        <li>
                            <strong>2 עצים או יותר:</strong> כל העצים שווים 0 - הקלף הגבוה ביותר
                            באותה צבע שאינו עץ מנצח.
                        </li>
                        <li>קלפים מצבע שונה (שאינם עצים) לא יכולים לנצח לעולם.</li>
                    </ul>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <p>לאחר שכל קלפי היד שוחקו (קלפי ההימור נשארים), ספרו:</p>
                    <ul>
                        <li><strong>נקודה 1</strong> לכל טריק שניצחתם.</li>
                        <li><strong>בונוס +5</strong> אם מספר הטריקים שניצחתם תואם להימורכם:</li>
                        <li class="indent">הימור 1 ← חייב לנצח בדיוק טריק אחד.</li>
                        <li class="indent">הימור 2 ← חייב לנצח בדיוק 2 טריקים.</li>
                        <li class="indent">הימור 🌳 ← חייב לנצח בדיוק 0 או 3 טריקים.</li>
                    </ul>
                    <p>הניקוד הגבוה ביותר מנצח!</p>
                </section>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useLang } from '../composables/useLang.js'

defineEmits(['close'])
const { lang } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
}
.modal {
    background: $bg-deep;
    border: 2px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 32px;
    max-width: 540px;
    width: 100%;
    color: $text;
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
    inset-inline-end: 16px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: $text;
    font-size: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: rgba(255, 255, 255, 0.18);
    }
}

h2 {
    font-size: 1.4rem;
    margin: 0;
    padding-inline-end: 36px;
}

section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
h3 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $green-light;
    margin: 0;
}
p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.5;
}
ul {
    margin: 0;
    padding-inline-start: 18px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
li {
    font-size: 0.92rem;
    line-height: 1.5;
}
li.indent {
    list-style: none;
    padding-inline-start: 12px;
    color: rgba(255, 255, 255, 0.7);
}
</style>
