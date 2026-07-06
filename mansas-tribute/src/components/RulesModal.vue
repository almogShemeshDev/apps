<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
                <h2>How to Play</h2>

                <section>
                    <h3>Overview</h3>
                    <p>A trick-taking dice game for 2–5 players. Play 8 rounds. Highest score wins.</p>
                </section>

                <section>
                    <h3>Setup</h3>
                    <p>
                        Each player starts with <strong>8 cards</strong> and
                        <strong>4 dice</strong>. A King's deck is set aside. At the start of the
                        game the King draws <strong>two cards</strong>: one sets the
                        <strong>lead suit</strong> and one sets the <strong>trump suit</strong>.
                    </p>
                </section>

                <section>
                    <h3>Playing a Round</h3>
                    <p>
                        A random player leads the first round. Going clockwise, each player must
                        <strong>follow the King's lead suit</strong> (play the same color) if they
                        can; otherwise they may play any card.
                    </p>
                    <p>
                        Each player may also attach any number of their dice to their play - the
                        dice values add to the total of that play.
                    </p>
                </section>

                <section>
                    <h3>Winning a Trick</h3>
                    <ul>
                        <li>
                            <strong>Trump-suit plays beat everything</strong> - if any were played,
                            only they compete for the win.
                        </li>
                        <li>Otherwise, only lead-suit plays compete.</li>
                        <li>
                            Among the competing plays, the
                            <strong>highest dice total</strong> wins.
                        </li>
                        <li>Ties go to the player who played first.</li>
                        <li>
                            If nobody played trump or followed suit, the highest total among all
                            plays wins.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>After the Trick</h3>
                    <p>
                        All played dice go into a shared pool. The winner leads the next round.
                        Losers may pick dice from the pool in order - the loser with the highest
                        total picks first.
                    </p>
                    <p>
                        The round's <strong>lead card becomes the next round's trump</strong>, and
                        the King reveals a fresh lead card.
                    </p>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <p>After 8 rounds, each player scores:</p>
                    <ul>
                        <li><strong>Tricks won</strong></li>
                        <li>
                            plus <strong>Bonus</strong> = floor(remaining dice sum ÷ tricks won)
                        </li>
                    </ul>
                    <p>Highest total wins!</p>
                </section>
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>סקירה כללית</h3>
                    <p>משחק קלפים עם קוביות ל-2–5 שחקנים. משחקים 8 סיבובים. הניקוד הגבוה ביותר מנצח.</p>
                </section>

                <section>
                    <h3>הכנה</h3>
                    <p>
                        כל שחקן מתחיל עם <strong>8 קלפים</strong> ו-<strong>4 קוביות</strong>.
                        חפיסת המלך מופרשת בצד. בתחילת המשחק המלך שולף
                        <strong>שני קלפים</strong>: אחד קובע את <strong>צבע ההובלה</strong> ואחד
                        את <strong>צבע הטראמפ</strong>.
                    </p>
                </section>

                <section>
                    <h3>מהלך הסיבוב</h3>
                    <p>
                        שחקן אקראי מוביל את הסיבוב הראשון. בכיוון השעון, כל שחקן חייב
                        <strong>לעקוב אחרי צבע ההובלה של המלך</strong> (לשחק אותו צבע) אם
                        ביכולתו; אחרת הוא רשאי לשחק כל קלף.
                    </p>
                    <p>
                        כל שחקן יכול גם לצרף כל מספר של קוביותיו - ערכי הקוביות מתווספים לסכום
                        הכולל של המהלך.
                    </p>
                </section>

                <section>
                    <h3>ניצחון בטריק</h3>
                    <ul>
                        <li>
                            <strong>קלפי טראמפ גוברים על הכול</strong> - אם שוחקו כאלה, רק הם
                            מתחרים על הניצחון.
                        </li>
                        <li>אחרת, רק מהלכים בצבע ההובלה מתחרים.</li>
                        <li>
                            מבין המהלכים המתחרים, השחקן עם
                            <strong>סכום הקוביות הגבוה ביותר</strong> מנצח.
                        </li>
                        <li>שוויון הולך לשחקן שניגן ראשון.</li>
                        <li>
                            אם אף אחד לא שיחק טראמפ ולא עקב אחרי צבע ההובלה, הסכום הגבוה ביותר
                            מכל המהלכים מנצח.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>לאחר הטריק</h3>
                    <p>
                        כל הקוביות שהונחו עוברות לבריכה משותפת. המנצח מוביל את הסיבוב הבא.
                        המפסידים יכולים לבחור קוביות מהבריכה לפי הסדר - המפסיד עם הסכום הגבוה
                        ביותר בוחר ראשון.
                    </p>
                    <p>
                        <strong>קלף ההובלה של הסיבוב הופך לטראמפ של הסיבוב הבא</strong>, והמלך
                        חושף קלף הובלה חדש.
                    </p>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <p>לאחר 8 סיבובים, כל שחקן מקבל:</p>
                    <ul>
                        <li><strong>טריקים שניצח</strong></li>
                        <li>
                            ועוד <strong>בונוס</strong> סכום קוביות שנותרו ÷ טריקים שניצח (מעוגל מטה)
                        </li>
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
    max-width: 520px;
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
    color: $gold;
    margin: 0;
    padding-inline-end: 36px;
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
    opacity: 0.8;
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
    gap: 3px;
}

li {
    font-size: 0.9rem;
    line-height: 1.5;
    color: $text-dim;
}
</style>
