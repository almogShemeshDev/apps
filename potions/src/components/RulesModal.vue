<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
                <h2>How to Play</h2>

                <section>
                    <h3>Overview</h3>
                    <p>A card-drafting game for 2–4 players. Each round the dealer splits dealt potions into groups, then everyone else drafts a whole group in turn. Fewer potions left in your hand at the end is better.</p>
                </section>

                <section>
                    <h3>Dealing &amp; Picking</h3>
                    <p>The dealer splits that round's dealt potions into one group per player. Then, starting left of the dealer, each player takes one whole group into their hand. The dealer takes whatever group is left over.</p>
                </section>

                <section>
                    <h3>Potion Abilities</h3>
                    <p>On your turn you may use any potions of a single color sitting in your hand:</p>
                    <ul>
                        <li><strong>2 of the same color</strong> — flip them face-down and apply that color's ability right away. These 2 flipped potions no longer count toward your hand, but together cost <strong>−2 points</strong> at the end of the game.</li>
                        <li><strong>3 of the same color</strong> — trash them with no ability effect.</li>
                        <li><strong>4 of the same color</strong> — trash them and apply that color's ability. If the ability has no valid target right now, you can still trash all 4 for no effect instead.</li>
                    </ul>
                </section>

                <section>
                    <h3>Color Abilities</h3>
                    <ul>
                        <li>🔵 <strong>Blue</strong> — draw the top potion of the deck, then return one potion from your hand to the bottom of the deck.</li>
                        <li>🔴 <strong>Red</strong> — trash 1 potion of another color from your hand.</li>
                        <li>🟡 <strong>Yellow</strong> — trash every potion of whichever other color you hold the fewest of.</li>
                        <li>🟢 <strong>Green</strong> — take any one potion from any group still being drafted into your hand.</li>
                        <li>⚪ <strong>White</strong> — has no ability of its own. Instead, spend 2 white potions to convert them into 1 wildcard potion of a color you choose. That wildcard merges with the real potions of that color already in your hand, immediately triggering that color's own rule: 1 real + wildcard = 2 → that color's flip-ability (with the usual −2 penalty); 2 real + wildcard = 3 → plain trash; 3 real + wildcard = 4 → trash + that color's ability.</li>
                    </ul>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <p>The game ends when the deck runs out. Each player scores <strong>−1 point per potion left in hand</strong>, minus 2 more for every pair of potions they flipped. Highest score wins!</p>
                </section>
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>סקירה כללית</h3>
                    <p>משחק רקיחת שיקויים ל-2–4 שחקנים. בכל סיבוב המחלק מחלק את השיקויים שחולקו לקבוצות, ואז כל שחקן אחר בוחר קבוצה שלמה בתורו. פחות שיקויים ביד בסוף המשחק — יותר טוב.</p>
                </section>

                <section>
                    <h3>חלוקה ובחירה</h3>
                    <p>המחלק מחלק את השיקויים שנחלקו באותו סיבוב לקבוצה אחת לכל שחקן. לאחר מכן, בהתחלה משמאל למחלק, כל שחקן לוקח קבוצה שלמה אחת לידו. המחלק לוקח את הקבוצה שנותרה.</p>
                </section>

                <section>
                    <h3>יכולות השיקויים</h3>
                    <p>בתורך תוכל להשתמש בשיקויים מצבע אחד שביד שלך:</p>
                    <ul>
                        <li><strong>2 מאותו צבע</strong> — הפוך אותם לצד השני והשתמש ביכולת הצבע מיידית. 2 השיקויים ההפוכים הללו לא נספרים יותר כחלק מהיד שלך, אך יחד עולים <strong><span dir="ltr">-2</span> נקודות</strong> בסוף המשחק.</li>
                        <li><strong>3 מאותו צבע</strong> — השמד אותם בלי אפקט יכולת.</li>
                        <li><strong>4 מאותו צבע</strong> — השמד אותם והשתמש ביכולת הצבע. אם אין ליכולת יעד תקף כרגע, אפשר במקום זאת פשוט להשמיד את כל ה-4 בלי אפקט.</li>
                    </ul>
                </section>

                <section>
                    <h3>יכולות הצבעים</h3>
                    <ul>
                        <li>🔵 <strong>כחול</strong> — שלוף את השיקוי העליון מהחבילה, ואז החזר שיקוי אחד מידך לתחתית החבילה.</li>
                        <li>🔴 <strong>אדום</strong> — השמד שיקוי אחד מצבע אחר מידך.</li>
                        <li>🟡 <strong>צהוב</strong> — השמד את כל השיקויים מהצבע האחר שיש לך הכי מעט ממנו.</li>
                        <li>🟢 <strong>ירוק</strong> — קח שיקוי אחד מכל קבוצה שעדיין נבחרת לידך.</li>
                        <li>⚪ <strong>לבן</strong> — אין לו יכולת משלו. במקום זאת, הוצא 2 שיקויי לבן כדי להמיר אותם ל-1 שיקוי ג'וקר מצבע לבחירתך. השיקוי הג'וקר מצטרף לשיקויים האמיתיים מאותו צבע שכבר ביד שלך, ומפעיל מיידית את החוק של אותו צבע: 1 אמיתי + ג'וקר = 2 ⟵ יכולת ההיפוך של הצבע (עם קנס <span dir="ltr">-2</span> הרגיל); 2 אמיתיים + ג'וקר = 3 ⟵ השמדה רגילה; 3 אמיתיים + ג'וקר = 4 ⟵ השמדה + יכולת הצבע.</li>
                    </ul>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <p>המשחק מסתיים כשהחבילה נגמרת. כל שחקן מקבל <strong><span dir="ltr">-1</span> נקודה על כל שיקוי שנותר בידו</strong>, ובנוסף <span dir="ltr">-2</span> על כל זוג שיקויים שהפך. הניקוד הגבוה ביותר מנצח!</p>
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
    background: $overlay-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
}

.modal {
    background: $bg-modal;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 32px;
    max-width: 560px;
    width: 100%;
    color: $text;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.btn-close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: $text;
    font-size: 1rem;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: rgba(255, 255, 255, 0.16);
    }
}

h2 {
    font-size: 1.3rem;
    font-weight: 900;
    color: $gold;
    margin: 0;
    padding-right: 32px;
}

section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

h3 {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $gold;
    margin: 0;
    opacity: 0.85;
}

p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: $text-dim;
}

ul {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

li {
    font-size: 0.9rem;
    line-height: 1.5;
    color: $text-dim;
}

[dir='rtl'] ul {
    padding-left: 0;
    padding-right: 18px;
}
</style>
