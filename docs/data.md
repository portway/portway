## Seed Data

Seed data is found in the `api/src/db/seeders` data and should be generated with sequelize

To add seed data:
`api/node_modules/.bin/sequelize seed:generate NAME`
If sequelize is globally installed, from the api directory running `sequelize seed:generate NAME` will work

The newly generated seed file can then add data as needed.

## Migrations

Migrations are automatically run when `make start` is invoked. If a migration has been edited, you'll need to run `make sequelize db:migrate:undo:all`, then `make sequelize db:migrate`. _Note:_ containers _must_ be running to use `make sequelize` commands!

## Sequelize

The Makefile is setup to execute any sequelize commands in the running API container. Run `make sequelize COMMAND` to run commands, or `make sequelize` to see a list of available commands

## Erase Database and Start Over

```
make sequelize db:migrate:undo:all
make sequelize db:migrate
make sequelize db:seed:all
```
