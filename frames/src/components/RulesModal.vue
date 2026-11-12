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
                        board, and an empty bag. The tile supply holds <strong>108 tiles</strong>,
                        split evenly across six categories, and 6 of them fill the market's
                        <strong>six fixed positions</strong>, numbered right to left.
                    </p>
                    <p>
                        A <strong>random player takes the first turn</strong>; play then proceeds
                        clockwise.
                    </p>
                </section>

                <section>
                    <h3>On Your Turn</h3>
                    <p>Do exactly one of the following:</p>
                    <ul>
                        <li>
                            <strong>Photograph</strong> — pick any market tile, pay its printed
                            Time cost (must meet its Creativity/Equipment requirement), add it to
                            your film strip and 1 white + 1 black cube to your bag. All paid
                            tokens land together on that tile's market position.
                        </li>
                        <li>
                            <strong>Upgrade</strong> — pick any market tile and raise
                            <em>any one track of your choice</em> by one. The cost is the tile's
                            market position number (1 at the rightmost up to 6 at the leftmost),
                            paid by placing one token on every position from the rightmost
                            through the one you chose.
                        </li>
                        <li>
                            <strong>Collect Time</strong> — take every Time token currently
                            sitting on one market position back into your hand. Tokens stay on
                            their position even as tiles move through the market, so piles build
                            up over time.
                        </li>
                    </ul>
                    <p>
                        Time never enters or leaves the game — it only moves between players and
                        the market.
                    </p>
                </section>

                <section>
                    <h3>Upgrade Tracks</h3>
                    <ul>
                        <li>
                            <strong>💡 Creativity</strong> — raises the Creativity level checked
                            against photo tiles' Creativity requirement.
                        </li>
                        <li>
                            <strong>📷 Equipment</strong> — raises the Equipment level checked
                            against photo tiles' Equipment requirement.
                        </li>
                        <li>
                            <strong>🧪 Development</strong> — grants one extra white cube added to
                            your bag right before film development begins.
                        </li>
                        <li>
                            <strong>🌑 Darkroom</strong> — grants one reusable redraw: during
                            development, a black cube you draw can be set aside to draw again
                            (each Darkroom upgrade you own can be used once across the whole
                            development phase).
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>End of Game</h3>
                    <p>
                        The game ends once a player reaches 16 photographs or the tile supply
                        (including every visible market tile) runs out. Play finishes the current
                        round first, so every player takes an equal number of turns.
                    </p>
                    <p>
                        Every player then develops their film, one photo at a time in film order.
                        First, each player adds one white cube to their bag per Development level.
                        Then draw a cube from your bag: white develops the photo; black burns it —
                        unless you have an unused Darkroom upgrade, which lets you set the black
                        cube aside and draw again (each Darkroom upgrade can be used once).
                    </p>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <ul>
                        <li><strong>Successful photos</strong> — +1 point each.</li>
                        <li>
                            <strong>Film sequences</strong> — bonus for runs of consecutive
                            same-theme developed photos in film order: 2 photos = +2, 3 = +5,
                            4 = +9, 5 = +14, then +5 per additional photo beyond 5.
                        </li>
                        <li>
                            <strong>Variety bonus</strong> — +5 points if you have successfully
                            developed photos of at least 4 different themes.
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
                        כל שחקן מתחיל עם <strong>5 אסימוני זמן</strong>, לוח שחקן ריק ושק ריק.
                        מלאי האריחים מכיל <strong>108 אריחים</strong>, מחולקים שווה בשווה בין
                        שש קטגוריות, ו-6 מהם ממלאים את <strong>שש העמדות הקבועות</strong> בשוק,
                        הממוספרות מימין לשמאל.
                    </p>
                    <p>
                        <strong>שחקן אקראי פותח את המשחק</strong>; מכאן המשחק ממשיך בכיוון
                        השעון.
                    </p>
                </section>

                <section>
                    <h3>בתורך</h3>
                    <p>בצע פעולה אחת בדיוק:</p>
                    <ul>
                        <li>
                            <strong>צלם</strong> — בחר אריח כלשהו מהשוק, שלם את עלות הזמן המודפסת
                            שלו (חייב לעמוד בדרישת היצירתיות/הציוד שלו), הוסף אותו לסרט הצילום שלך
                            וקובייה לבנה אחת וקובייה שחורה אחת לשק שלך. כל האסימונים ששולמו
                            מונחים יחד על העמדה של אותו אריח.
                        </li>
                        <li>
                            <strong>שדרג</strong> — בחר אריח כלשהו מהשוק והעלה
                            <em>כל מסלול לבחירתך</em> בדרגה אחת. העלות היא מספר העמדה של האריח
                            בשוק (1 בעמדה הימנית ביותר ועד 6 בשמאלית ביותר), ומשולמת בהנחת אסימון
                            אחד על כל עמדה מהימנית ביותר ועד העמדה שנבחרה.
                        </li>
                        <li>
                            <strong>אסוף זמן</strong> — קח את כל אסימוני הזמן שמונחים כרגע על עמדה
                            אחת בשוק חזרה לידך. האסימונים נשארים על העמדה שלהם גם כשהאריחים זזים
                            בשוק, כך שהערימות מצטברות עם הזמן.
                        </li>
                    </ul>
                    <p>הזמן לא נכנס או עוזב את המשחק - הוא רק עובר בין השחקנים לשוק.</p>
                </section>

                <section>
                    <h3>מסלולי שדרוג</h3>
                    <ul>
                        <li>
                            <strong>💡 יצירתיות</strong> — מעלה את רמת היצירתיות הנבדקת מול דרישת
                            היצירתיות של אריחי צילום.
                        </li>
                        <li>
                            <strong>📷 ציוד</strong> — מעלה את רמת הציוד הנבדקת מול דרישת הציוד של
                            אריחי צילום.
                        </li>
                        <li>
                            <strong>🧪 פיתוח</strong> — מעניק קובייה לבנה נוספת לשק שלך ממש לפני
                            תחילת שלב פיתוח הסרט.
                        </li>
                        <li>
                            <strong>🌑 חדר חושך</strong> — מעניק הגרלה חוזרת אחת לשימוש: במהלך
                            הפיתוח, קובייה שחורה שהוגרלה יכולה להיות מונחת בצד כדי להגריל שוב (כל
                            שדרוג חדר חושך שברשותך ניתן לשימוש פעם אחת לאורך כל שלב הפיתוח).
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>סוף המשחק</h3>
                    <p>
                        המשחק מסתיים כאשר שחקן מגיע ל-16 תמונות או כאשר מלאי האריחים (כולל כל
                        אריחי השוק הנראים) אוזל. המשחק מסיים את הסבב הנוכחי קודם, כך שכל שחקן
                        מקבל מספר תורות שווה.
                    </p>
                    <p>
                        כל שחקן מפתח אז את הסרט שלו, תמונה אחת בכל פעם לפי סדר הסרט. ראשית, כל
                        שחקן מוסיף קובייה לבנה אחת לשק שלו על כל דרגת פיתוח. לאחר מכן הגרל קובייה
                        מהשק שלך: לבן מפתח את התמונה; שחור שורף אותה - אלא אם יש לך שדרוג חדר
                        חושך שלא נוצל, המאפשר לך להניח את הקובייה השחורה בצד ולהגריל שוב (כל
                        שדרוג חדר חושך ניתן לשימוש פעם אחת).
                    </p>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <ul>
                        <li><strong>תמונות מוצלחות</strong> — נקודה אחת לכל תמונה.</li>
                        <li>
                            <strong>רצפי סרט</strong> — בונוס עבור רצפים של תמונות שפותחו מאותה
                            קטגוריה ברצף לפי סדר הסרט: 2 תמונות = +2, 3 = +5, 4 = +9, 5 = +14, ואז
                            +5 לכל תמונה נוספת מעבר ל-5.
                        </li>
                        <li>
                            <strong>בונוס גיוון</strong> — +5 נקודות אם יש לך תמונות שפותחו
                            בהצלחה מלפחות 4 קטגוריות שונות.
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
