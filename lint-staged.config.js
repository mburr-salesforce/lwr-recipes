module.exports = {
    '**/*.ts': () => 'tsc --noEmit',
    '**/*.{js,ts}': 'eslint',
    '{packages,scripts}/**/*.{js,ts,json,md}': 'prettier --write'
};
