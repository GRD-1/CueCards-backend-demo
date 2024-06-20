# CueCards
<p style="display: block; width: 100%; text-align:left;">An application for learning proverbs in a foreign language</p>

<p style="display: block; width: 100%; text-align:left;">
  <a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v18.16.0-blue?logo=nodedotjs" alt="Node.js Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v4.7.4-blue?logo=typescript" alt="TypeScript Version" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?logo=nestjs" alt="Nest.js Version" /></a>
  <a href="" target="_blank"><img src="https://img.shields.io/badge/covarage-0%25-%2300c642?style=flat" alt="Coverage" /></a>
  <a href="" rel="nofollow"><img src="https://img.shields.io/badge/istall_size-0%20KB-%23ebdb32?style=flat" alt="install size"></a>
</p>

## Contents

1. [Stack](#Stack)
2. [Launch](#launch)
3. [Tests](#tests)
4. [Database](#tests)
5. [CI/CD](#cicd)
6. [Documentation](#documentation)

## Stack

<div>
    <div>
          <div style="display: flex; flex-wrap: wrap; height: 300px;">
            <div style="width: 40%; height: fit-content;"><a href="https://ubuntu.com/" target="_blank"><img src="https://img.shields.io/badge/Linux_Ubuntu-v22.04-blue?style=for-the-badge&logo=ubuntu" alt="Linux Ubuntu Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://jestjs.io/" target="_blank"><img src="https://img.shields.io/badge/Jest-v29.0.5-blue?style=for-the-badge&logo=jest" alt="Jest Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.docker.com/products/docker-desktop/" target="_blank"><img src="https://img.shields.io/badge/docker-v24.0.2-blue?style=for-the-badge&logo=docker" alt="Docker Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.npmjs.com/package/supertest" target="_blank"><img src="https://img.shields.io/badge/supertest-v6.1.3-blue?style=for-the-badge" alt="Supertest Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v18.16.0-blue?style=for-the-badge&logo=nodedotjs" alt="Node.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://eslint.org/" target="_blank"><img src="https://img.shields.io/badge/eslint-v8.51.0-blue?style=for-the-badge&logo=eslint" alt="Eslint Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v4.7.4-blue?style=for-the-badge&logo=typescript" alt="TypeScript Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://prettier.io/" target="_blank"><img src="https://img.shields.io/badge/prettier-v2.3.2-blue?style=for-the-badge&logo=prettier" alt="Prettier Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?style=for-the-badge&logo=nestjs" alt="Nest.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/postgresql-v14.0.0-blue?style=for-the-badge&logo=postgresql" alt="Postgres Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://typeorm.io/" target="_blank"><img src="https://img.shields.io/badge/typeorm-v0.3.17-blue?style=for-the-badge" alt="TypeOrm Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/badge/npm-v9.5.1-blue?style=for-the-badge&logo=npm" alt="npm Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/commitizen/cz-cli" target="_blank"><img src="https://img.shields.io/badge/commitizen-cz_cli-blue?style=for-the-badge" alt="Commitizen" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/typicode/husky" target="_blank"><img src="https://img.shields.io/badge/husky-v.8.0.3-blue?style=for-the-badge" alt="Husky Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions" target="_blank"><img src="https://img.shields.io/badge/CICD-Github_actions-blue?style=for-the-badge&logo=githubactions" alt="Github Actions" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/semantic-release/semantic-release" target="_blank"><img src="https://img.shields.io/badge/semantic_release-v.22.0.8-blue?style=for-the-badge&logo=semanticrelease" alt="Semantic-release" /></a></div>
          </div>
    </div>
</div>

## Launch

1. Install <a href="https://nodejs.org/en" target="_blank">Node</a> Node >=20.14.0
2. Install <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker</a>
3. Install dependencies:
``` bash
$ npm i
```
4. Copy environment variables:
``` bash
$ cp .env.sample .env
```
5. Run docker:
``` bash
$ docker compose -f ./docker/docker-compose.yml --env-file .env up -d
```
6. Run the application using package.json scripts, e.g:
``` bash
$ npm run start:dev
```
## Tests

1. Prepare environment:
``` bash
$ docker compose -f ./docker/docker-compose.test.yml --env-file .env.test up -d
```
2. Run the specific test set using package.json scripts, or all the tests at once, e.g:
``` bash
$ npm run test
```

## Database

* As a dbms uses postgres v16.0.0. It is defined in the [docker-compose](docker/docker-compose.yml). 
This version was chosen deliberately, because of the postgres-cron-backup package, which does not work with later versions of postgresql.
* As an orm model uses Prisma v5.15.0
* migrations are here: [prisma/migrations](prisma/migrations)
* To work with migrations in local mode use the scripts like "db:*" from [package.json](package.json)
* For docker mode, use short commands:

``` bash
$  docker exec cuecards-node-dev npm run db:generate
```
``` bash
$  docker exec cuecards-node-dev npm run db:migrate
```
``` bash
$  docker exec cuecards-node-dev npm run db:drop
```

## CI/CD

Husky + GitHub actions + semantic-release

## Documentation
### Swagger API map
* current API map is here: [./public/api-json.json](./public/api-json.json)
* When the server is running, the API map is available at: http://localhost:3000/api
* To get the API json go to http://localhost:3000/api-json

### Compodoc
To see the project structure run the script:
``` bash
$ npm run compodoc
```
It is possible to face an access error while the script starts ("Error: EACCES: permission denied ...).
In this case we need to configure access permissions to the database folder: 
``` bash
$ sudo chmod -R u=rwX,go=rX db
```
The documentation will be available at: http://localhost:8080/

### releases
For releases, we use "Major.Minor.Patch" notation. The history of changes is here: ./CHANGELOG.md
