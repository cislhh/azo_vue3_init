import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: { css: true, html: true },
  // 启用缓存，提升重复检查性能
  cache: true,
  // 缓存位置
  cacheLocation: './node_modules/.cache/eslint-cache',
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'off'
  }
})