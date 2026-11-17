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
                        An <strong>Equipment die</strong> and a <strong>Creativity die</strong> are
                        each rolled onto one of the six positions (both may land on the same one).
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
                            <strong>Photograph</strong> — pick any market tile and pay its printed
                            Time cost (must meet its Creativity/Equipment requirement, raised by
                            +1 for whichever track's die currently sits on that position). All
                            paid tokens land above that position. Add the tile to your film strip
                            and 1 white + 1 black cube to your bag.
                        </li>
                        <li>
                            <strong>Upgrade</strong> — pick any market tile and pay its printed
                            Time cost. The position decides which track rises by one: positions
                            1–2 raise Equipment, 3–4 Creativity, 5 Darkroom, 6 Development. Payment
                            is placed below the market, one token per position starting at the
                            leftmost position (6) and continuing rightward for as many positions
                            as the cost.
                        </li>
                        <li>
                            <strong>Gain Time</strong> — pick one market position and one of its
                            two piles, above or below, and take every Time token sitting there
                            back into your hand.
                        </li>
                        <li>
                            <strong>Pass</strong> — only when none of the three actions above are
                            possible: not enough Time or tracks for any tile, and nothing to gain
                            from any pile.
                        </li>
                    </ul>
                    <p>
                        After a Photograph or Upgrade, tiles shift one position toward the taken
                        slot and the market refills from the left with the next tile in the draw
                        pile. Time tokens stay attached to their fixed positions throughout — they
                        never move with the tiles, and never enter or leave the game, only moving
                        between players and the market.
                    </p>
                </section>

                <section>
                    <h3>Requirement Dice</h3>
                    <p>
                        While the Equipment die sits on a position, that tile's Equipment
                        requirement is +1 higher than printed; the Creativity die works the same
                        way for Creativity. These modifiers apply to Photograph only. A die only
                        rerolls to a new position once a Photograph (not an Upgrade) is taken from
                        the position it sits on, after the market has refreshed.
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
                        The game ends once the combined photographs taken by all players reach
                        <strong>8 × the number of players</strong> (e.g. 32 for 4 players), or the
                        tile supply (including every visible market tile) runs out. Play finishes
                        the current round first, so every player takes an equal number of turns.
                    </p>
                    <p>
                        Every player then develops their film, one photo at a time in film order.
                        First, each player adds one white cube to their bag per Development level.
                        Then draw a cube from your bag — drawn cubes are never returned to the bag:
                        white develops the photo; black burns it, breaking any scoring sequence in
                        progress — unless you have an unused Darkroom upgrade, which lets you set
                        the black cube aside and draw again (each Darkroom upgrade can be used once
                        across the whole development phase).
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
                        <strong>קובית ציוד</strong> ו<strong>קובית יצירתיות</strong> מוגרלות, כל
                        אחת לעמדה אחת מבין השש (שתיהן יכולות לנחות על אותה עמדה).
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
                            <strong>צלם</strong> — בחר אריח כלשהו מהשוק ושלם את עלות הזמן המודפסת
                            שלו (חייב לעמוד בדרישת היצירתיות/הציוד שלו, הגבוהה ב-1 אם קובית אותו
                            מסלול יושבת כרגע על העמדה הזו). כל האסימונים ששולמו מונחים מעל העמדה.
                            הוסף את האריח לסרט הצילום שלך וקובייה לבנה אחת וקובייה שחורה אחת לשק
                            שלך.
                        </li>
                        <li>
                            <strong>שדרג</strong> — בחר אריח כלשהו מהשוק ושלם את עלות הזמן המודפסת
                            שלו. העמדה קובעת איזה מסלול עולה בדרגה אחת: עמדות 1–2 מעלות ציוד,
                            3–4 יצירתיות, 5 חדר חושך, 6 פיתוח. התשלום מונח מתחת לשוק, אסימון אחד
                            על כל עמדה, בהתחלה מהעמדה השמאלית ביותר (6) וממשיך ימינה כמספר העמדות
                            שהעלות מכסה.
                        </li>
                        <li>
                            <strong>קבל זמן</strong> — בחר עמדה אחת בשוק וערימה אחת שלה, מעל או
                            מתחת, וקח את כל אסימוני הזמן שמונחים שם חזרה לידך.
                        </li>
                        <li>
                            <strong>דלג</strong> — רק כאשר אף אחת משלוש הפעולות הקודמות אינה
                            אפשרית: אין מספיק זמן או מסלולים לאף אריח, ואין מה לקבל מאף ערימה.
                        </li>
                    </ul>
                    <p>
                        לאחר צילום או שדרוג, האריחים זזים עמדה אחת לכיוון החריץ שהתרוקן והשוק
                        מתמלא מחדש מצד שמאל מהקלף הבא בחפיסה. אסימוני הזמן נשארים על העמדות
                        הקבועות שלהם לכל אורך הדרך - הם לא זזים עם האריחים, ולא נכנסים או עוזבים
                        את המשחק, רק עוברים בין השחקנים לשוק.
                    </p>
                </section>

                <section>
                    <h3>קוביות הדרישה</h3>
                    <p>
                        כל עוד קובית הציוד יושבת על עמדה, דרישת הציוד של האריח שבה גבוהה ב-1
                        מהמודפס; קובית היצירתיות עובדת באותו אופן עבור יצירתיות. השינויים הללו
                        חלים על פעולת הצילום בלבד. קובייה מוגרלת מחדש לעמדה חדשה רק כאשר מצלמים
                        (ולא משדרגים) מהעמדה שעליה היא יושבת, אחרי שהשוק התחדש.
                    </p>
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
                        המשחק מסתיים כאשר סכום התמונות שצולמו על ידי כל השחקנים מגיע ל-
                        <strong>8 כפול מספר השחקנים</strong> (למשל 32 ב-4 שחקנים), או כאשר מלאי
                        האריחים (כולל כל אריחי השוק הנראים) אוזל. המשחק מסיים את הסבב הנוכחי
                        קודם, כך שכל שחקן מקבל מספר תורות שווה.
                    </p>
                    <p>
                        כל שחקן מפתח אז את הסרט שלו, תמונה אחת בכל פעם לפי סדר הסרט. ראשית, כל
                        שחקן מוסיף קובייה לבנה אחת לשק שלו על כל דרגת פיתוח. לאחר מכן הגרל קובייה
                        מהשק שלך - קוביות שהוגרלו לא חוזרות לשק: לבן מפתח את התמונה; שחור שורף
                        אותה ומנתק כל רצף ניקוד בתהליך - אלא אם יש לך שדרוג חדר חושך שלא נוצל,
                        המאפשר לך להניח את הקובייה השחורה בצד ולהגריל שוב (כל שדרוג חדר חושך ניתן
                        לשימוש פעם אחת לאורך כל שלב הפיתוח).
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
