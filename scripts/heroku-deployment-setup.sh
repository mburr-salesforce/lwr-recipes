#!/bin/bash
PACKAGES=('base-slds' 'custom-middleware' 'hello-world' 'labels' 'locker' 'metrics' 'module-provider' 'nested-routing' 'routing-extended-metadata' 'security' 'services' 'simple-routing' 'templating')

for package in "${PACKAGES[@]}"
do
    app_name="lwr-$package"
    heroku create -a $app_name
    heroku buildpacks:add -a $app_name heroku/nodejs
    heroku buildpacks:add -a $app_name https://github.com/heroku/heroku-buildpack-multi-procfile.git
    heroku config:set -a $app_name PROCFILE=packages/$package/Procfile
done
