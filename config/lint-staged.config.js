module.exports = {
    '**/*.ts': () => 'tsc --noEmit',
    '**/*.{js,ts}': 'yarn lint',
    '{packages,config,doc}/**/*.{js,ts,json,md}': 'yarn format',
};
