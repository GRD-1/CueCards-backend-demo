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
3. [Usage](#usage)
4. [Environment](#environment)
5. [Settings](#settings)
6. [Tests](#tests)
7. [Database](#tests)
8. [Logs](#tests)
9. [CI/CD](#cicd)
10. [Documentation](#documentation)

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

The project is prepared to launch via the docker.You need to install <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker</a>

and then run the corresponding command in the terminal.


* for development mode use:

``` bash

$ docker stop $(docker ps -aq)

$ docker-compose -f docker/docker-compose.yml --env-file env/.env.dev --env-file env/.env.node --env-file env/.env.postgres-dev up -d

$ docker logs cuecards-node-dev -f --tail 30

```

* for debug mode use:

``` bash

$ docker stop $(docker ps -aq)

$ docker-compose -f docker/docker-compose.yml --env-file env/.env.debug --env-file env/.env.node --env-file env/.env.postgres-dev up -d

$ docker logs cuecards-node-debug -f --tail 30

```

* for product mode use:

``` bash

$ docker stop $(docker ps -aq)

$ docker-compose -f docker/docker-compose.yml --env-file env/.env.prod --env-file env/.env.node --env-file env/.env.postgres-prod up -d

```

* for test mode use:

``` bash

$ docker stop $(docker ps -aq)

$ docker-compose -f docker/docker-compose.yml --env-file env/.env.test --env-file env/.env.node --env-file env/.env.postgres-dev up -d

```

## Usage

[//]: # (* After the service is launched it is available at http://localhost:3000/api/)

## Environment

[//]: # (Environment variables are here: ./env. )

[//]: # (Key environment variables are connected to the project using docker-compose files at the [env_file] section.)

[//]: # (Inside the application, environment variables are mounted using the built-in Nest.js module "ConfigModule".)

## Settings

[//]: # (* the settings are here: ./src/config/config.ts)

## Tests

[//]: # (* To perform the tests you need to be loaded in [Test mode]&#40;#Launch&#41;. It's important because the tests use a database &#40;!&#41;)

[//]: # ()
[//]: # (```bash)

[//]: # (# unit tests)

[//]: # ($ docker exec cuecards-node-test npm run test)

[//]: # (```)

[//]: # ()
[//]: # (```bash)

[//]: # (# e2e tests)

[//]: # ($ docker exec cuecards-node-test npm run test:e2e)

[//]: # (```)

[//]: # ()
[//]: # (```bash)

[//]: # (# test coverage)

[//]: # ($ docker exec cuecards-node-test npm run test:cov)

[//]: # (```)

## Logs

## Database

* As a dbms uses postgres v14.0.0. It is defined in the [docker-compose](docker/docker-compose.yml). 
This version was chosen deliberately, because of the postgres-cron-backup package, which does not work with later versions of postgresql.
* As an orm model uses TypeOrm v0.3.17
* migrations are here: [src/typeorm/migration](src/typeorm/migration)
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

the workflow files are here: .github/workflows

## Documentation
### API
When the server is running, the API map is available at: http://localhost:3000/api
### Compodoc
To see the project structure run the script:
``` bash
$ npm run compodoc
```
It is possible to face an access error while the script starts ("Error: EACCES: permission denied ...).
In this case we need to configure access permissions to the database folder: [ sudo chmod -R u=rwX,go=rX db/dev/data ]
The documentation will be available at: http://localhost:8080/
