# Portway 🔥

To get started, you'll need Docker installed, then run the following commands

## Local development
```
cp api/example.env api/.env
cp web/src/server/example.env web/src/server/.env
make builddev
make start
make sequelize db:seed:all # Run in a separate shell _while_ app is running
make stop
```

#### Changed a dependency in package.json?
While the app is running in docker (make start), run:
```
make install[service] # Service is "web" or "api" (eg "make installweb")
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
3. [Known Issues in the Codebase](docs/Known-Issues.md)
