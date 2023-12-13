import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
  },
  {
    rules: {
      'no-console': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'unused-imports/no-unused-vars': 'off',
      // 'unused-imports/no-unused-imports': 'off',
    },
  },
)
