import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default antfu(
    {
        vue: true,
        typescript: true,
        // 启用缓存，提升重复检查性能
        cache: true,
        // 缓存位置
        cacheLocation: './node_modules/.cache/eslint-cache',
        // 忽略 otherfile 文件夹
        ignores: ['otherfile/**', 'public/onlyoffice-plugins/**'],
    },
    {
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'vue/multi-word-component-names': 'off',
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
            'jsonc/indent': 'off',
            'jsonc/sort-keys': 'off',
            'pnpm/yaml-enforce-settings': 'off',
            'yaml/indent': 'off',
            'node/prefer-global/process': 'off',
            'unused-imports/no-unused-vars': 'off',
        },
    },
    eslintConfigPrettier,
);
