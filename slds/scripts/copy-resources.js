const cpx = require('cpx');
const { log } = console;

// Copy the SLDS resources to the buildDir
cpx.copy('node_modules/@salesforce-ux/design-system/assets/**/*', 'src/assets', () => {
    log(`Done copying SLDS resources`);
});