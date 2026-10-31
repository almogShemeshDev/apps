<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
                <h2>How to Play</h2>

                <section>
                    <h3>Overview</h3>
                    <p>
                        A push-your-luck shopping cart game for 2–5 players. Draw products toward a
                        shared, circular free-shipping window — go too low or too high and your order
                        fails. Score points by diversifying what you ship, not just how much.
                    </p>
                </section>

                <section>
                    <h3>The Deck</h3>
                    <p>
                        A shared 60-card deck: 45 unique products (9 from each of 5 categories) and 15
                        special cards (3 copies each of 5 types). Every card has a price that adds to
                        your order total when drawn — specials included.
                    </p>
                </section>

                <section>
                    <h3>Your Turn</h3>
                    <p>
                        Draw cards one at a time into your order. Each draw adds its price to the
                        order total, which is checked against the shared shipping window's minimum
                        and maximum:
                    </p>
                    <ul>
                        <li><strong>Within the window</strong> — you may Ship or keep drawing.</li>
                        <li>
                            <strong>Below the minimum</strong> — you may keep drawing or voluntarily
                            stop (a failure).
                        </li>
                        <li>
                            <strong>Above the maximum</strong> — you can no longer draw. Rescue the
                            order with a special card, or accept failure.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>Shipping or Failing</h3>
                    <p>
                        <strong>Ship</strong> while within the window to score VP (see Scoring below),
                        keep every product and special card you drew, and advance the shared window
                        one level forward (level 5 wraps to level 1).
                    </p>
                    <p>
                        <strong>Failing</strong> — whether forced or voluntary — discards your whole
                        order and retreats the shared window one level back (level 1 wraps to level
                        5). You keep nothing from that turn.
                    </p>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <p>
                        A shipment's VP comes from how many <strong>distinct product categories</strong>
                        it contains, not from the products themselves. Extra products from a category
                        you already shipped add nothing. Special cards never count as a category.
                    </p>
                    <ul>
                        <li>1 category = 1 VP</li>
                        <li>2 categories = 3 VP</li>
                        <li>3 categories = 6 VP</li>
                        <li>4 categories = 10 VP</li>
                        <li>5 categories = 15 VP</li>
                    </ul>
                </section>

                <section>
                    <h3>Special Cards</h3>
                    <p>
                        Special cards add their price to your order like any product, but you can only
                        use one after a <em>later</em> successful shipment brings it into your
                        inventory — never the turn you draw it. Once held, use it on any future turn;
                        each card is single-use.
                    </p>
                    <ul>
                        <li><strong>Discount Coupon</strong> (price 3) — reduce the order total by 3.</li>
                        <li>
                            <strong>Free Return</strong> (price 4) — remove the most recently drawn
                            product from the order.
                        </li>
                        <li>
                            <strong>Tax Insurance</strong> (price 5) — raise this turn's maximum by 5.
                        </li>
                        <li>
                            <strong>Flash Sale</strong> (price 4) — reduce the price of up to 2
                            products in the order by 2 each.
                        </li>
                        <li>
                            <strong>Sneak Peek</strong> (price 2) — reveal the next deck card and
                            choose whether to draw it.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>Game End</h3>
                    <p>
                        Once the deck runs out, play continues until every player has had an equal
                        number of turns in that final round. The player with the highest total VP
                        wins; a tie is shared.
                    </p>
                </section>
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>סקירה כללית</h3>
                    <p>
                        משחק עגלת קניות ל-2–5 שחקנים. שולפים מוצרים כדי להגיע לטווח המשלוח החינמי
                        המשותף והמעגלי — אם תרדו נמוך מדי או תעלו גבוה מדי, ההזמנה תיכשל. מנקדים על
                        ידי גיוון השליחה, לא רק על כמות.
                    </p>
                </section>

                <section>
                    <h3>החבילה</h3>
                    <p>
                        חבילה משותפת של 60 קלפים: 45 מוצרים ייחודיים (9 מכל אחת מ-5 קטגוריות) ו-15
                        קלפים מיוחדים (3 עותקים מכל אחד מ-5 סוגים). לכל קלף יש מחיר שמתווסף לסכום
                        ההזמנה כשהוא נשלף — כולל קלפים מיוחדים.
                    </p>
                </section>

                <section>
                    <h3>התור שלך</h3>
                    <p>
                        שולפים קלפים אחד אחד להזמנה. כל שליפה מוסיפה את מחירה לסכום ההזמנה, שנבדק מול
                        המינימום והמקסימום של חלון המשלוח המשותף:
                    </p>
                    <ul>
                        <li><strong>בתוך הטווח</strong> — אפשר לשלוח את ההזמנה או להמשיך לשלוף.</li>
                        <li>
                            <strong>מתחת למינימום</strong> — אפשר להמשיך לשלוף או לעצור מרצון (כישלון).
                        </li>
                        <li>
                            <strong>מעל המקסימום</strong> — אי אפשר לשלוף יותר. אפשר להציל את ההזמנה
                            עם קלף מיוחד, או לקבל את הכישלון.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>שליחה או כישלון</h3>
                    <p>
                        <strong>שליחה</strong> בזמן שההזמנה בתוך הטווח מזכה בנק"ז (ראו ניקוד למטה),
                        שומרת את כל המוצרים והקלפים המיוחדים שנשלפו, ומקדמת את חלון המשלוח המשותף
                        רמה אחת קדימה (רמה 5 חוזרת לרמה 1).
                    </p>
                    <p>
                        <strong>כישלון</strong> — בין אם נכפה ובין אם מרצון — מבטל את כל ההזמנה ומחזיר
                        את חלון המשלוח המשותף רמה אחת אחורה (רמה 1 חוזרת לרמה 5). לא נשאר לכם כלום
                        מהתור הזה.
                    </p>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <p>
                        נק"ז של משלוח מגיע ממספר <strong>הקטגוריות השונות</strong> שהוא מכיל, ולא
                        מהמוצרים עצמם. מוצרים נוספים מקטגוריה שכבר נשלחה לא מוסיפים כלום. קלפים
                        מיוחדים לעולם לא נחשבים כקטגוריה.
                    </p>
                    <ul>
                        <li>קטגוריה אחת = 1 נק"ז</li>
                        <li>2 קטגוריות = 3 נק"ז</li>
                        <li>3 קטגוריות = 6 נק"ז</li>
                        <li>4 קטגוריות = 10 נק"ז</li>
                        <li>5 קטגוריות = 15 נק"ז</li>
                    </ul>
                </section>

                <section>
                    <h3>קלפים מיוחדים</h3>
                    <p>
                        קלפים מיוחדים מוסיפים את מחירם להזמנה כמו כל מוצר, אך ניתן להשתמש בהם רק לאחר
                        ששליחה מוצלחת <em>מאוחרת יותר</em> מכניסה אותם למלאי שלכם — לעולם לא באותו
                        תור שבו נשלפו. לאחר שהם ברשותכם, אפשר להשתמש בהם בכל תור עתידי; כל קלף הוא
                        חד-פעמי.
                    </p>
                    <ul>
                        <li><strong>קופון הנחה</strong> (מחיר 3) — מפחית את סכום ההזמנה ב-3.</li>
                        <li>
                            <strong>החזרה חינם</strong> (מחיר 4) — מסיר את המוצר האחרון שנשלף
                            מההזמנה.
                        </li>
                        <li><strong>ביטוח מכס</strong> (מחיר 5) — מעלה את המקסימום של התור ב-5.</li>
                        <li>
                            <strong>מכירת פלאש</strong> (מחיר 4) — מפחית את מחירם של עד 2 מוצרים
                            בהזמנה ב-2 כל אחד.
                        </li>
                        <li>
                            <strong>הצצה חטופה</strong> (מחיר 2) — חושפת את הקלף הבא בחבילה ומאפשרת
                            לבחור אם לשלוף אותו.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>סוף המשחק</h3>
                    <p>
                        כשהחבילה נגמרת, המשחק ממשיך עד שלכל שחקן היה מספר שווה של תורות בסיבוב
                        האחרון. השחקן עם סך הנק"ז הגבוה ביותר מנצח; תיקו מתחלק.
                    </p>
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
    background: $surface;
    border: 1px solid $border;
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
        background: rgba(74, 63, 47, 0.1);
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
    padding-inline-start: 18px;
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
