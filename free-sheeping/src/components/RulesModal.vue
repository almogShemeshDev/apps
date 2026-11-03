<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <button class="btn-close" @click="$emit('close')">✕</button>

            <template v-if="lang === 'en'">
                <h2>How to Play</h2>

                <section>
                    <h3>Overview</h3>
                    <p>
                        A push-your-luck shopping cart game for 2–5 players. Draw cards into your
                        order one at a time, then stop whenever you like to keep some of what you
                        drew. Draw too many problem cards and the whole order is canceled. Build the
                        biggest, most diverse product collection by the end of the game to win.
                    </p>
                </section>

                <section>
                    <h3>The Deck</h3>
                    <p>
                        A shared deck that scales with player count, always split evenly across the 5
                        categories:
                    </p>
                    <ul>
                        <li>2–3 players → 70 cards (45 products, 15 bonus cards, 10 problem cards)</li>
                        <li>4 players → 100 cards (65 products, 20 bonus cards, 15 problem cards)</li>
                        <li>5 players → 120 cards (80 products, 20 bonus cards, 20 problem cards)</li>
                    </ul>
                    <p>
                        The extra copies that join bigger games are marked with a small
                        <strong>4+</strong> or <strong>5</strong> badge. Product prices range from 1 to
                        5 and add to your order total when drawn; problem cards cost nothing but add to
                        your problem points (8 worth 1 point, 2 worth 2 points, scaled the same way).
                    </p>
                </section>

                <section>
                    <h3>Your Turn</h3>
                    <p>
                        Draw cards one at a time into your cart, and stop voluntarily after any draw.
                        There's no limit on how high your order total can climb — but your accumulated
                        problem points are capped. Reaching <strong>3 or more problem points
                        immediately cancels the order</strong>: every card in the cart is discarded and
                        you get nothing from the turn.
                    </p>
                </section>

                <section>
                    <h3>Stopping &amp; Keeping</h3>
                    <p>
                        When you stop successfully, how many products you may keep depends on how
                        many product cards are in your cart:
                    </p>
                    <ul>
                        <li>1–3 products → keep 1</li>
                        <li>4–5 products → keep 2</li>
                        <li>6–7 products → keep 3</li>
                        <li>8+ products → keep 4</li>
                    </ul>
                    <p>
                        Unchosen products are discarded, but their price already counted toward the
                        order total. All bonus cards in the cart are kept separately, in addition to
                        your chosen products. Problem cards are always discarded.
                    </p>
                </section>

                <section>
                    <h3>Shipping Fees &amp; Taxes</h3>
                    <p>
                        The free-shipping window is fixed at <strong>8–13</strong> for the whole game.
                        When you stop successfully, your order total is compared against it:
                    </p>
                    <ul>
                        <li>Below 8 → a flat −2 VP shipping fee.</li>
                        <li>8–13 → free, no fee.</li>
                        <li>
                            Above 13 → every positive-price card that pushed your total over 13, or
                            that was drawn afterward, is taxed <strong>−1 VP each</strong>. A Discount
                            Coupon's discount is applied first, so it can shrink or erase the tax.
                            Zero-price problem cards are never taxed.
                        </li>
                    </ul>
                    <p>
                        These penalties accumulate across the game — shown as face-down cards next to
                        your name — and are subtracted from your final score. A canceled order pays
                        nothing; it simply yields no cards.
                    </p>
                </section>

                <section>
                    <h3>Scoring</h3>
                    <p>
                        Scoring happens once, at the end of the game, based on your entire collection
                        of kept products. Each of the five categories is scored separately by how many
                        products you collected in it:
                    </p>
                    <ul>
                        <li>0–1 products = 0 VP</li>
                        <li>2 products = 2 VP</li>
                        <li>3 products = 5 VP</li>
                        <li>4 products = 9 VP</li>
                        <li>5 or more products = 14 VP</li>
                    </ul>
                    <p>
                        On top of that, collecting <strong>at least one product from all five
                        categories</strong> earns a <strong>5 VP diversity bonus</strong>. Add the five
                        category scores and the bonus, then subtract your accumulated shipping fees,
                        for your final score.
                    </p>
                </section>

                <section>
                    <h3>Bonus Cards</h3>
                    <p>
                        Bonus cards add their price to your order like any product, but you can only
                        use one after a <em>later</em> turn's successful stop brings it into your
                        inventory — never the turn you draw it. Once held, play it on any future turn
                        before drawing again or stopping; each card is single-use. A canceled order
                        cannot be rescued once it has already reached 3 problem points.
                    </p>
                    <ul>
                        <li><strong>Discount Coupon</strong> (price 3) — reduce the order total by 5.</li>
                        <li><strong>Free Return</strong> (price 4) — remove one product from the cart.</li>
                        <li>
                            <strong>Shipping Insurance</strong> (price 5) — cancel up to 2 accumulated
                            problem points.
                        </li>
                        <li><strong>Extra Pick</strong> (price 4) — keep one additional product.</li>
                        <li>
                            <strong>Sneak Peek</strong> (price 2) — look at the next 2 deck cards and
                            return them in either order.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>Game End</h3>
                    <p>
                        Once the deck runs out, play continues until every player has had an equal
                        number of turns in that final round. The player with the highest final score
                        wins; a tie is shared.
                    </p>
                </section>
            </template>

            <template v-else>
                <h2>איך משחקים</h2>

                <section>
                    <h3>סקירה כללית</h3>
                    <p>
                        משחק עגלת קניות ל-2–5 שחקנים. שולפים קלפים אחד אחד להזמנה, ועוצרים מתי שרוצים
                        כדי לשמור חלק ממה שנשלף. שליפת יותר מדי קלפי תקלה מבטלת את כל ההזמנה. בנו את
                        האוסף הגדול והמגוון ביותר עד סוף המשחק כדי לנצח.
                    </p>
                </section>

                <section>
                    <h3>החבילה</h3>
                    <p>חבילה משותפת שגודלה תלוי במספר השחקנים, ומתחלקת שווה בשווה בין 5 הקטגוריות:</p>
                    <ul>
                        <li>2–3 שחקנים ← 70 קלפים (45 מוצרים, 15 קלפי בונוס, 10 קלפי תקלה)</li>
                        <li>4 שחקנים ← 100 קלפים (65 מוצרים, 20 קלפי בונוס, 15 קלפי תקלה)</li>
                        <li>5 שחקנים ← 120 קלפים (80 מוצרים, 20 קלפי בונוס, 20 קלפי תקלה)</li>
                    </ul>
                    <p>
                        העותקים הנוספים שמצטרפים במשחקים גדולים יותר מסומנים בתגית קטנה
                        <strong>4+</strong> או <strong>5</strong>. מחירי המוצרים נעים בין 1 ל-5
                        ומתווספים לסכום ההזמנה כשהם נשלפים; קלפי תקלה לא עולים כלום אך מוסיפים
                        לנקודות התקלה שלכם (8 בשווי נקודה אחת, 2 בשווי שתי נקודות, גם הם מתרבים
                        באותו יחס).
                    </p>
                </section>

                <section>
                    <h3>התור שלך</h3>
                    <p>
                        שולפים קלפים אחד אחד לעגלה, ועוצרים מרצון אחרי כל שליפה. אין הגבלה על כמה
                        סכום ההזמנה יכול לעלות — אבל נקודות התקלה שנצברו מוגבלות.
                        <strong>הגעה ל-3 נקודות תקלה או יותר מבטלת את ההזמנה באופן מיידי</strong>:
                        כל הקלפים בעגלה נגרסים ולא מקבלים כלום מהתור.
                    </p>
                </section>

                <section>
                    <h3>עצירה ושמירה</h3>
                    <p>כשעוצרים בהצלחה, כמה מוצרים אפשר לשמור תלוי במספר קלפי המוצרים בעגלה:</p>
                    <ul>
                        <li>1–3 מוצרים ← שמרו 1</li>
                        <li>4–5 מוצרים ← שמרו 2</li>
                        <li>6–7 מוצרים ← שמרו 3</li>
                        <li>8+ מוצרים ← שמרו 4</li>
                    </ul>
                    <p>
                        מוצרים שלא נבחרו נגרסים, אך מחירם כבר נספר לסכום ההזמנה. כל קלפי הבונוס
                        בעגלה נשמרים בנפרד, בנוסף למוצרים שנבחרו. קלפי תקלה נגרסים תמיד.
                    </p>
                </section>

                <section>
                    <h3>עמלות משלוח ומיסים</h3>
                    <p>
                        טווח המשלוח החינמי קבוע ב-<strong>8–13</strong> לכל אורך המשחק. כשעוצרים
                        בהצלחה, סכום ההזמנה נבדק מולו:
                    </p>
                    <ul>
                        <li>מתחת ל-8 ← עמלת משלוח קבועה של -2 נק"ז.</li>
                        <li>8–13 ← משלוח חינם, בלי עמלה.</li>
                        <li>
                            מעל 13 ← כל קלף בעל מחיר חיובי שהעביר את הסכום את ה-13, או שנשלף
                            אחריו, ממוסה ב-<strong>1- נק"ז כל אחד</strong>. ההנחה של קופון ההנחה
                            מחושבת קודם, כך שהיא יכולה להקטין או לבטל את המיסוי. קלפי תקלה בשווי 0
                            לעולם לא ממוסים.
                        </li>
                    </ul>
                    <p>
                        העונשים הללו נצברים במהלך המשחק — ומוצגים כקלפים הפוכים לצד שמכם — ומופחתים
                        מהניקוד הסופי. הזמנה שבוטלה לא משלמת כלום — היא פשוט לא מזכה בקלפים.
                    </p>
                </section>

                <section>
                    <h3>ניקוד</h3>
                    <p>
                        הניקוד מתבצע פעם אחת, בסוף המשחק, על בסיס כל אוסף המוצרים ששמרתם. כל אחת
                        מחמש הקטגוריות מנוקדת בנפרד לפי מספר המוצרים שאספתם בה:
                    </p>
                    <ul>
                        <li>0–1 מוצרים = 0 נק"ז</li>
                        <li>2 מוצרים = 2 נק"ז</li>
                        <li>3 מוצרים = 5 נק"ז</li>
                        <li>4 מוצרים = 9 נק"ז</li>
                        <li>5 מוצרים או יותר = 14 נק"ז</li>
                    </ul>
                    <p>
                        בנוסף, איסוף <strong>לפחות מוצר אחד מכל חמש הקטגוריות</strong> מזכה
                        ב<strong>בונוס גיוון של 5 נק"ז</strong>. סכמו את חמשת ניקודי הקטגוריות
                        והבונוס, ואז הפחיתו את עמלות המשלוח שנצברו, לניקוד הסופי שלכם.
                    </p>
                </section>

                <section>
                    <h3>קלפי בונוס</h3>
                    <p>
                        קלפי בונוס מוסיפים את מחירם להזמנה כמו כל מוצר, אך ניתן להשתמש בהם רק לאחר
                        שעצירה מוצלחת <em>בתור מאוחר יותר</em> מכניסה אותם למלאי שלכם — לעולם לא
                        באותו תור שבו נשלפו. לאחר שהם ברשותכם, אפשר לשחק אותם בכל תור עתידי לפני
                        שליפה נוספת או עצירה; כל קלף הוא חד-פעמי. הזמנה שהגיעה כבר ל-3 נקודות תקלה
                        לא ניתנת להצלה.
                    </p>
                    <ul>
                        <li><strong>קופון הנחה</strong> (מחיר 3) — מפחית את סכום ההזמנה ב-5.</li>
                        <li><strong>החזרה חינם</strong> (מחיר 4) — מסיר מוצר אחד מהעגלה.</li>
                        <li><strong>ביטוח משלוח</strong> (מחיר 5) — מבטל עד 2 נקודות תקלה שנצברו.</li>
                        <li><strong>בחירה נוספת</strong> (מחיר 4) — שומר מוצר נוסף אחד.</li>
                        <li>
                            <strong>הצצה חטופה</strong> (מחיר 2) — חושפת את 2 הקלפים הבאים בחבילה
                            ומאפשרת להחזיר אותם בכל סדר.
                        </li>
                    </ul>
                </section>

                <section>
                    <h3>סוף המשחק</h3>
                    <p>
                        כשהחבילה נגמרת, המשחק ממשיך עד שלכל שחקן היה מספר שווה של תורות בסיבוב
                        האחרון. השחקן עם הניקוד הסופי הגבוה ביותר מנצח; תיקו מתחלק.
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
