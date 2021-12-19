# Wiki

The wiki is deployed on [the official iGEM website](https://2021.igem.org/Team:EPFL) and [GitLab pages](https://epfl-igem.gitlab.io/wiki/).


## Build

```sh
# Development
$ npm install
$ npm run build:watch

# Production
$ npm install
$ npm run build

# Publish wiki
$ git checkout live
$ git merge master
$ git push origin live
```
