import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A theme-park building game — details coming soon',
    startGame: 'Start Game',
    comingSoon: 'Rules and gameplay are still being designed.',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק בניית פארק שעשועים — פרטים בקרוב',
    startGame: 'התחל משחק',
    comingSoon: 'החוקים ואופן המשחק עדיין בתכנון.',

    credits: '© 2026 אלמוג שמש · עיצוב ורעיון המשחק · כל הזכויות שמורות',
  },
}

export function useLang() {
  function t(key, ...args) {
    const val = strings[lang.value]?.[key] ?? strings.en[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
  const dir = computed(() => lang.value === 'he' ? 'rtl' : 'ltr')
  function toggleLang() { lang.value = lang.value === 'en' ? 'he' : 'en' }
  return { lang, t, dir, toggleLang }
}
