# Project Danger 🔥

To get started, you'll need Docker installed, then run the following commands

## Local development
```
cp api/example.env api/.env
cp web/src/server/example.env web/src/server/.env
make builddev
make start
make sequelize db:seed:all
make stop
```

#### Changed a dependency in package.json?
```
make rebuilddev
make start
```

## Production
#### Production image build
`make build`

## Tests
#### Run API tests
`make test-api`

#### Problem with a test image or changed a dependency in package.json?
```
make rebuildtest
make test-api
```

## Documentation

1. [Express and Webpack Build](docs/Web.md)
2. [Populating/Undoing/Creating Seed data](docs/data.md)
