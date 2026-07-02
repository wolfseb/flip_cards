export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**'],
        files: ['src/**/*{ts,tsx}'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 2024,
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            import: require('eslint-plugin-import'),
            'simple-import-sort': require('eslint-plugin-simple-import-sort'),
            prettier: require('eslint-plugin-prettier'),
            'unused-imports': require('eslint-plugin-unused-imports'),
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
            },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                { allowExpressions: true },
            ],
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/ban-ts-comment': ['error'],

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import/order': 'off',

            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],

            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
];
