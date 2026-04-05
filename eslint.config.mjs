import antfu from '@antfu/eslint-config';

export default antfu(
    {
        vue: true,
        typescript: true,
        formatters: {
            css: true,
            html: true,
        },
        // 启用缓存，提升重复检查性能
        cache: true,
        // 缓存位置
        cacheLocation: './node_modules/.cache/eslint-cache',
        // 忽略 otherfile 文件夹
        ignores: ['otherfile/**'],
    },
    {
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'vue/multi-word-component-names': 'off',
            // 保持与 prettier 一致的代码风格
            'style/indent': ['error', 4],
            'style/quotes': ['error', 'single'],
            'style/semi': ['error', 'always'],
            'style/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'none',
                        requireLast: false,
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false,
                    },
                },
            ],
            // Vue 模板格式化
            'vue/html-closing-bracket-newline': 'off',
            'vue/html-self-closing': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            // import 排序
            'perfectionist/sort-imports': 'off',
            'import/order': 'off',
            // 其他规则调整
            'antfu/top-level-function': 'off',
            'antfu/if-newline': 'off',
            'unicorn/prefer-node-protocol': 'off',
            'style/arrow-parens': 'off',
            'ts/no-empty-object-type': 'off',
            'import/newline-after-import': 'off',
            'jsonc/sort-keys': 'off',
            'pnpm/yaml-enforce-settings': 'off',
            'node/prefer-global/process': 'off',
            'unused-imports/no-unused-vars': 'off',
        },
    },
    {
        // 仅对 .vue 文件应用 Vue 特定规则
        files: ['**/*.vue'],
        rules: {
            'vue/html-indent': ['error', 4],
        },
    },
);
