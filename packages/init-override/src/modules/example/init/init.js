import { init as lwrInit } from 'lwr/init';
export function init(rootModules) {
    const renamedModules = rootModules.map(([moduleSpecifier, ctor]) => {
        // Change the namespace of each lwc to "my"
        // They will appear in the browser markup as <my-{name}>
        const [, name] = moduleSpecifier.split('/');
        return [`my/${name}`, ctor];
    });
    lwrInit(renamedModules);
}