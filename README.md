# CueCards
<p style="display: block; width: 100%; text-align:left;">An application for learning proverbs in a foreign language</p>

<p style="display: block; width: 100%; text-align:left;">
  <a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v20.14.0-blue?logo=nodedotjs" alt="Node.js Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5.3.2-blue?logo=typescript" alt="TypeScript Version" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?logo=nestjs" alt="Nest.js Version" /></a>
  <a href="" target="_blank"><img src="https://img.shields.io/badge/covarage-21%25-%2300c642?style=flat" alt="Coverage" /></a>
  <a href="" rel="nofollow"><img src="https://img.shields.io/badge/istall_size-219KB-%23ebdb32?style=flat" alt="install size"></a>
</p>

## Contents

1. [Stack](#stack)
2. [Launch](#launch)
3. [Tests](#tests)
4. [Data storage](#data-storage)
5. [CI/CD](#cicd)
6. [Documentation](#documentation)

## Stack

<div>
    <div>
          <div style="display: flex; flex-wrap: wrap; height: 300px;">
            <div style="width: 40%; height: fit-content;"><a href="https://ubuntu.com/" target="_blank"><img src="https://img.shields.io/badge/Linux_Ubuntu-v22.04-blue?style=for-the-badge&logo=ubuntu" alt="Linux Ubuntu Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.docker.com/products/docker-desktop/" target="_blank"><img src="https://img.shields.io/badge/docker-v24.0.2-blue?style=for-the-badge&logo=docker" alt="Docker Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nodejs.org/en/about" target="_blank"><img src="https://img.shields.io/badge/Node.js-v20.14.0-blue?style=for-the-badge&logo=nodedotjs" alt="Node.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Nest.js-v9.4.2-blue?style=for-the-badge&logo=nestjs" alt="Nest.js Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5.3.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://redis.io/" target="_blank"><img src="https://img.shields.io/badge/Redis-v7.2.4-blue?style=for-the-badge&logo=redis" alt="Redis Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/postgresql-v16.0.0-blue?style=for-the-badge&logo=postgresql&logoColor=%2313BEF9" alt="Postgres Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://www.prisma.io/docs" target="_blank"><img src="https://img.shields.io/badge/Prisma_ORM-v5.15.0-blue?style=for-the-badge&logo=prisma" alt="Prisma Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://jestjs.io/" target="_blank"><img src="https://img.shields.io/badge/Jest-v29.0.5-blue?style=for-the-badge&logo=jest" alt="Jest Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/typicode/husky" target="_blank"><img src="https://img.shields.io/badge/husky-v8.0.3-blue?style=for-the-badge" alt="Husky Version" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions" target="_blank"><img src="https://img.shields.io/badge/CICD-Github_actions-blue?style=for-the-badge&logo=githubactions" alt="Github Actions" /></a></div>
            <div style="width: 40%; height: fit-content;"><a href="https://github.com/semantic-release/semantic-release" target="_blank"><img src="https://img.shields.io/badge/semantic_release-v22.0.8-blue?style=for-the-badge&logo=semanticrelease" alt="Semantic-release" /></a></div>
          </div>
    </div>
</div>

## Launch

1. TLS certificates: put the certificate to the "certificates" folder: ./certificates/certificate.pem, ./certificates/csr.pem, ./certificates/private-key.pem
2. JWT keys: put the keys for JWT to the "keys" folder: ./keys/private.pem, ./keys/public.pem
3. CORS: optionally you can specify the domains that can have access to the API in the .env variable APP_CORS_DOMAINS
4. Install <a href="https://nodejs.org/en" target="_blank">Node</a> Node >=20.14.0
5. Install <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker</a> and <a href="https://docs.docker.com/compose/" target="_blank">Docker-compose</a>
6. Install dependencies:
``` bash
$ npm i
```
7. Copy environment variables:
``` bash
$ cp .env.sample .env
```
8. Run docker:
``` bash
$ docker compose -f ./docker/docker-compose.yml --env-file .env up -d
```
9. Update database:
``` bash
$ npm run migration:up
```
10. Seed database:
``` bash
$ npm run prisma:seed-sync && npm run prisma:seed
```
11. Run the application using package.json scripts, e.g:
``` bash
$ npm run start:dev
```
## Tests

1. Prepare environment:
``` bash
$ npm run prepare-test-env
```
2. Run the specific test set using package.json scripts, or all the tests at once, e.g:
``` bash
$ npm run test
```

## Data storage

* IMDB: <a href="https://redis.io/" target="_blank">Redis</a> v7.2.4
* DBMS: <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> v16.0.0
* ORM: <a href="https://www.prisma.io/" target="_blank">Prisma</a> v5.15.0
    * schema is here: [./prisma/migrations](prisma/schema.prisma)
    * migrations are here: [./prisma/migrations](prisma/migrations)
    * prisma repositories are here: [./src/modules/prisma/repositories](src/modules/prisma/repositories)
    * To update the schema use the scripts like ""prisma:*" from [package.json](package.json)
    * To work with migrations use the scripts like "migration:*" from [package.json](package.json)
* Seeding db: <a href="https://snaplet-seed.netlify.app/seed/getting-started/overview" target="_blank">Snaplet</a> v0.97.20
    * To seed a database use the script "prisma:seed" from [package.json](package.json)
    * To synchronize the seed schema with the current prisma schema use the script "prisma:seed-sync" from [package.json](package.json)
    * To change the seed schema update the files from [./prisma/seed](prisma/seed)
* Backups: <a href="ghcr.io/mentos1386/postgres-cron-backup" target="_blank">postgres-cron-backup</a> v2.0.1
    * backup is created automatically each time the application is launched and again before shutting down  
    * backup files are sored here: [./db](db)

## CI/CD

The following technologies are used for CI part:
* <a href="https://github.com/typicode/husky" target="_blank">Husky</a>
* <a href="https://www.npmjs.com/package/@commitlint/cli" target="_blank">@commitlint/cli</a>
* <a href="https://docs.github.com/en/actions">GitHub actions</a>
* <a href="https://semantic-release.gitbook.io/semantic-release">semantic-release</a>

## Documentation
### Swagger API map
* In a development mode you can get access to the API map
* To switch the project to development mode, in [.env](.env) set NODE_ENV=development
* The API map will be available at: https://localhost:3000/api
* To get the API json go to https://localhost:3000/api-json

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
The documentation will be available at: https://localhost:8080/

### Releases
For releases, I use "Major.Minor.Patch" notation along with a <a href="https://github.com/semantic-release-bot" target="_blank">semantic-release-bot</a>. 
A history of changes is here: [./CHANGELOG.md](CHANGELOG.md)
