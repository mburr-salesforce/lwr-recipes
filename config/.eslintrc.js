module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['prettier', '@typescript-eslint'],
    parser: '@typescript-eslint/parser',

    overrides: [
        {
            files: ['*.ts'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
                'prettier/@typescript-eslint',
            ],
            rules: {
                'prettier/prettier': 0,
                '@typescript-eslint/explicit-function-return-type': 1,
                '@typescript-eslint/camelcase': 0,
                '@typescript-eslint/class-name-casing': 0,
                '@typescript-eslint/ban-types': 0,
            },
        },
        {
            files: ['*.js'],
            env: {
                browser: true,
                node: true,
                es6: true,
                jest: true,
            },
            extends: ['eslint:recommended'],
        },
    ],
};
