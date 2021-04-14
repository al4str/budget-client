# Home Budget
Single page application for managing home budget which uses [budget-api](https://github.com/al4str/budget-api)

> DISCLAIMER: Despite the fact that this is a pet project (which is still under development and was created for my own family needs), it can be considered as an indicator of some of my professional skills. Yes, I am aware of bugs and deficiencies like a lack of tests or strong typing

![budget-client](https://user-images.githubusercontent.com/30177370/114713542-e5db8e00-9d39-11eb-9a4b-6ea46a5b2bed.jpg)

## Description
Application is written in ES2015+ and ESM modules.
CSS Modules for managing style sheets.
`react` for generating markup.
`Fetch API` for obtaining data.
Global state is managed by custom singleton stores, which export: state getter, dispatcher, specific business logic methods and useHook to "hook" into `react`'s pipeline to get most fresh data. To decrease meaningless re-renders custom connector is used (like in `redux` but for hooks). Local state simply is managed by `useState`.
Dual compilation for legacy and modern browsers by `webpack`.
CSS is linted by `stylelint`, compiled from `scss` and autoprefixed with `postcss`.
Javascript is linted by `eslint` and transpiled with `babel`.
All artifacts get content hash in their names to avoid manual cache invalidation and force browsers to store files for a year at least.
Some dynamically loaded modules (like route components) has named `webpack` ids to be able to be prefetched or preloaded during runtime.
Free autocompletion and type checking by abusing `jsdoc` annotations in `WebStorm`.
Application is deployed on `DigitalOcean` droplet.
Building is done inside `docker` container. Then artefacts are copied to host machine and container is destroyed.
Finally, artefacts are served by `nginx` with `http2`, `gzip` and 1 year caching strategy.

## Local development
```shell
# copy env file
cp depoly/.env.example .env

# install dependencies
npm install

# run nodemon, webpack, api server
npm run dev
```

## Other scripts
```shell
# build and run dev server for legacy version of application
npm run dev:legacy

# same, but for modern browsers (equals to `npm run dev`)
npm run dev:modern

# open bundle analyzer page
npm run analyze

# test production build
npm run start

# run eslint and stylelint for all source files
npm run lint
```
