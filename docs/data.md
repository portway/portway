## Seed Data
**7/20 Update:**
Seed data does not integrate with Stripe and other services and is not recommended for using and running the app!

Seed data is found in the `api/src/db/seeders` data and should be generated with sequelize

To add seed data:
`api/node_modules/.bin/sequelize seed:generate NAME`
If sequelize is globally installed, from the api directory running `sequelize seed:generate NAME` will work

The newly generated seed file can then add data as needed.

## Migrations

Migrations are automatically run when `make start` is invoked. If a migration has been edited, you'll need to run the following:

```
make sequelize db:migrate:undo:all
make sequelize db:migrate
make sequelize db:seed:all
```

Or for JJ or Jay only: `make sequelize db:migrate:undo:all && make sequelize db:migrate && make sequelize db:seed:all`

_Note:_ containers _must_ be running to use `make sequelize` commands!

## Sequelize

The Makefile is setup to execute any sequelize commands in the running API container. Run `make sequelize COMMAND` to run commands, or `make sequelize` to see a list of available commands

## Erase Database and Start Over

`make cleardev`
OR
`make rebuilddev`

## Create a database dump
Start the app: `make start`
In a separate shell, run the following to create a dump:
> docker exec -t portway_db_1 pg_dumpall -c -U bonkey > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
