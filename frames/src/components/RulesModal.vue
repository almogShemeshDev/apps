<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
                <h2>How to Play</h2>

                <section>
                    <h3>Overview</h3>
                    <p>
                        A tile-laying, set-collection, push-your-luck game about analog
                        photography for 2–5 players. Take photos, level up your skills, and
                        develop your film at the end of the game.
                    </p>
                </section>

                <section>
                    <h3>Setup</h3>
                    <p>
                        Each player starts with <strong>5 Time tokens</strong>, an empty player
                        board, and an empty bag. 4 tiles are revealed to the shared market.
                    </p>
                </section>

                <section>
                    <h3>On Your Turn</h3>
                    <p>Do exactly one of the following:</p>
                    <ul>
                        <li>
                            <strong>Take Photo</strong> — pay a market tile's photo Time cost
                            (must meet its Creativity/Equipment requirement), add it to your film
                            strip, and add 1 white + 1 black cube to your bag.
                        </li>
                        <li>
                            <strong>Buy Upgrade</strong> — pay a market tile's upgrade Time cost
                            and raise that track by one. Most upgrades add 1 black cube to your
                            bag; Knowledge upgrades remove one instead.
                        </li>
                        <li><strong>Pass</strong> — leave the tile and gain 1 Time token.</li>
                    </ul>
                </section>

                <section>
                    <h3>End of Game</h3>
                    <p>
                        The game ends once the tile supply runs out. Every player then develops
                        their film, one photo at a time in film order: draw a cube from your bag.
                        White develops the photo; black burns it — unless you have an unused
                        Darkroom upgrade, which lets you set the black cube aside and draw again
                        (each Darkroom upgrade can be used once).
                    </p>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <ul>
                        <li>Only successfully developed photos score, worth their Time cost.</li>
                        <li>
                            Bonus points for long runs of consecutive, same-category developed
                            photos in your film strip.
                        </li>
                    </ul>
                    <p>Highest total wins!</p>
                </section>
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>סקירה כללית</h3>
                    <p>
                        משחק הנחת אריחים, איסוף סטים ו"עד כמה להסתכן" על צילום אנלוגי, ל-2–5
                        שחקנים. צלמו תמונות, שדרגו את הכישורים שלכם ופתחו את הסרט שלכם בסוף המשחק.
                    </p>
                </section>

                <section>
                    <h3>הכנה</h3>
                    <p>
                        כל שחקן מתחיל עם <strong>5 אסימוני זמן</strong>, לוח שחקן ריק ושקית ריקה.
                        4 אריחים נחשפים לשוק המשותף.
                    </p>
                </section>

                <section>
                    <h3>בתורך</h3>
                    <p>בצע פעולה אחת בדיוק:</p>
                    <ul>
                        <li>
                            <strong>צלם תמונה</strong> — שלם את עלות הזמן של צד הצילום של אריח
                            מהשוק (חייב לעמוד בדרישת היצירתיות/הציוד), הוסף אותו לסרט הצילום שלך,
                            והוסף קובייה לבנה אחת וקובייה שחורה אחת לשקית שלך.
                        </li>
                        <li>
                            <strong>קנה שדרוג</strong> — שלם את עלות הזמן של צד השדרוג של אריח
                            והעלה את המסלול המתאים בדרגה אחת. רוב השדרוגים מוסיפים קובייה שחורה
                            אחת לשקית; שדרוגי ידע מסירים אחת במקום זאת.
                        </li>
                        <li><strong>ותר</strong> — השאר את האריח וקבל אסימון זמן אחד.</li>
                    </ul>
                </section>

                <section>
                    <h3>סוף המשחק</h3>
                    <p>
                        המשחק מסתיים כאשר מלאי האריחים אוזל. כל שחקן מפתח אז את הסרט שלו, תמונה
                        אחת בכל פעם לפי סדר הסרט: הגרל קובייה מהשקית שלך. לבן מפתח את התמונה; שחור
                        שורף אותה - אלא אם יש לך שדרוג חדר חושך שלא נוצל, המאפשר לך להניח את
                        הקובייה השחורה בצד ולהגריל שוב (כל שדרוג חדר חושך ניתן לשימוש פעם אחת).
                    </p>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <ul>
                        <li>רק תמונות שפותחו בהצלחה מקבלות ניקוד, בשווי עלות הזמן שלהן.</li>
                        <li>
                            נקודות בונוס עבור רצפים ארוכים של תמונות שפותחו מאותה קטגוריה ברצף
                            בסרט הצילום שלך.
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
    color: $amber;
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
    color: $amber;
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
