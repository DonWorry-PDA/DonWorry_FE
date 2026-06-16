export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme', 'variant', 'utility', 'apply', 'source'],
      },
    ],
  },
}
