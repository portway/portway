# Pipelines

Portway's CI/CD is run on [Codefresh](https://codefresh.io)

The pipelines are found in the `pipelines` directory in the repo. There are 3 different pipelines:
1. Test
1. Release
1. Deploy

### 1. Test

The test pipeline is run whenever a PR is opened. The PR'd branch will be pulled down on Codefresh,
and development/test builds of the Portway services will be built and tested.

### 2. Release

The release pipeline is triggered whenever a tagged release is created on Github. This pipeline
creates the Docker images from the tagged codebase. The images are pushed to the Portway
Docker Hub Registry

### 3. Deploy

TBD but will read version tags from somewhere and deploy them to the noted environments.
This pipeline exists with a functional deploy step but is not plugged into any triggers and is
not setup in Codefresh yet.