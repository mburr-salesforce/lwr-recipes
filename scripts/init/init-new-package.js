#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const replaceSymbols = (content, name, lwcVersion, lwrVersion, wdioVersion, chromedriverVersion) => {
    return content
        .replace(/{name}/g, name)
        .replace(/{lwcVersion}/g, lwcVersion)
        .replace(/{lwrVersion}/g, lwrVersion)
        .replace(/{wdioVersion}/g, wdioVersion)
        .replace(/{chromedriverVersion}/g, chromedriverVersion);
};

const copyDirectory = (src, dest, name, lwcVersion, lwrVersion, wdioVersion, chromedriverVersion) => {
    fs.mkdirSync(dest, { recursive: true });

    const files = fs.readdirSync(src);

    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath, name, lwcVersion, lwrVersion, wdioVersion, chromedriverVersion);
        } else {
            const content = fs.readFileSync(srcPath, 'utf-8');
            const newContent = replaceSymbols(content, name, lwcVersion, lwrVersion, wdioVersion, chromedriverVersion);
            fs.writeFileSync(destPath, newContent, 'utf-8');
        }
    }
};

const main = async () => {
    const templateDir = 'scripts/init/recipe-template';
    const outputDir = 'packages';

    rl.question('Enter the name for the new recipe: ', (name) => {
        // Read default versions from another recipe
        const packageJsonPath = path.join(outputDir, 'simple-routing', 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJsonObj = JSON.parse(packageJsonContent);
        const lwcVersion = packageJsonObj.devDependencies.lwc || packageJsonObj.dependencies.lwc;
        const lwrVersion = packageJsonObj.devDependencies.lwr || packageJsonObj.dependencies.lwr;
        const wdioVersion = packageJsonObj.devDependencies.webdriverio || '^8.10.4';
        const chromedriverVersion = packageJsonObj.devDependencies.chromedriver || '^112.0.0';

        const newDirectoryPath = path.join(outputDir, name);
        copyDirectory(templateDir, newDirectoryPath, name, lwcVersion, lwrVersion, wdioVersion, chromedriverVersion);

        console.log(`New Recipe created at: ${newDirectoryPath}`);
        rl.close();
    });
};

main();
