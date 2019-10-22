# Pipelines

Portway's CI/CD is run on [Codefresh](https://codefresh.io)

The pipelines are found in the `pipelines` directory in the repo. There are 3 different pipelines:
1. Test
1. Release
1. Deploy

### 1. Test

The test pipeline is run whenever a PR is opened. The PR'd branch will be pulled down on Codefresh, and development/test builds of the Portway services will be built and tested. See `pipelines/test.yml`

### 2. Release

The release pipeline is triggered whenever a tagged release is created on Github. This pipeline creates the Docker images from the tagged codebase. The images are pushed to the Portway Docker Hub Registry. See `pipelines/release.yml`

### 3. Deploy

The deploy pipeline takes a tagged release version and deploys it to the respective environment. Deployments are configured to occur whenever the `master` branch changes, and a file inside `deploys` has changed. For example: to deploy a release to the dev environment, edit `deploys/dev.txt` to put the release tag you'd like to deploy to the dev environment. To find available releases, look at the Releases in Github. Each release is tied to a git tag. The tag is the release version to put in `deploys/dev.txt`