#!/bin/bash
PACKAGES=('base-slds' 'custom-middleware' 'hello-world' 'labels' 'locker' 'metrics' 'module-provider' 'nested-routing' 'routing-extended-metadata' 'security' 'services' 'simple-routing' 'templating')

for package in "${PACKAGES[@]}"
do
    heroku_app_name="https://git.heroku.com/lwr-$package.git"
    git push $heroku_app_name HEAD:main
done
