/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss'],
    rules: {
        // Tailwind CSS v4 允许未知指令
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': null,
        // 允许自定义属性模式
        'custom-property-pattern': null,
        // 允许未知选择器（Tailwind 类名）
        'selector-type-no-unknown': null,
        // 允许自定义类名模式
        'selector-class-pattern': null,
        // 允许字符串形式的 import
        'import-notation': null,
        // 颜色函数格式
        'color-function-notation': null,
        'color-function-alias-notation': null,
        'color-hex-length': 'short',
        'alpha-value-notation': 'number',
        // 字体名称大小写
        'value-keyword-case': null,
        // 媒体查询格式
        'media-feature-range-notation': null,
        // 空行规则
        'rule-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'custom-property-empty-line-before': null,
        // SCSS 运算符
        'scss/operator-no-unspaced': null,
        // 禁止浏览器前缀（由 PostCSS 处理）
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        // 禁止重复属性
        'declaration-block-no-duplicate-properties': true,
        // 禁止冗余的简写属性
        'declaration-block-no-redundant-longhand-properties': true,
    },
    ignoreFiles: [
        'public/**',
        'node_modules/**',
        'dist/**',
        '.next/**',
        'otherfile/**',
        '**/*.vue', // 暂时不检查 Vue 文件
    ],
};
