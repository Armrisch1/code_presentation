## Description

Hayerenik children online shop.

## Installation

- Install node.js 20.9.0 version on your system
- Install mysql 8.1 version on your system
- Write your db credentials in .env file
- Create database named `hayerenik` or name you wrote in your .env

```bash
$ yarn install
$ yarn migrate:seed
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

Nest is [MIT licensed](LICENSE).
