![Portway Image](docs/portway-github.png)

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

### Development Workflow

We use the Github flow process off of the `release` branch

1. Create a feature branch off of `release`
1. Commit changes to your feature branch
1. PR your feature branch into `release`. CI will run tests.
1. PR is reviewed, updated if warranted, and merged!

At this point, releases and deployments can be performed. See below.

#### Changed a dependency in package.json?
While the app is running in docker (make start), run:
```
make install[service] # Service is "web" or "api" (eg "make installweb")
```

## Release and Deployments

### Create a Release

A release is the artifacts needed to perform a deployment. In Portway's case, a release consists of Docker images for each Portway service. To create a release:
1. Draft a new release in Github
1. Choose the `release` branch as the target
1. Enter a semver tag
1. Describe what's in the release in the description
1. Publish the release! This triggers the CI server to build the Docker images and push them to Docker Hub.

### Deploy a release

1. Create a `deploy-[environment]-[tag]` branch from `main`. Eg `deploy-dev-2.41.1`
1. Replace the contents of `deploys/dev.txt` with `2.41.1`. Commit and push to Github.
1. PR the `deploy-dev-2.41.1` branch into `main`
1. Once approved and merged, the CI/CD service will deploy the 2.41.1 release to dev!

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
