# Project Danger 🔥

To get started, you'll need Docker installed, then run the following commands

```
// Local development
cp api/example.env api/.env
cp web/src/server/example.env web/src/server/.env
make builddev
make start
make stop

// Changed a dependency in package.json?
make cleardev
make builddev
make start

// Production image build
make build
```

## Documentation

1. [Express and Webpack Build](docs/BUILD.md)
