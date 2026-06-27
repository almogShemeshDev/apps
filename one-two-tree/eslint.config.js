import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from '@vue/eslint-config-prettier'
import globals from 'globals'

export default [
    { languageOptions: { globals: { ...globals.browser } } },
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    prettierConfig,
    {
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
]
