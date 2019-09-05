# Environment Variables

When adding or changing an environment variable:
1. Update the example.env file
1. Update the 1password .env file
1. Update the kubernetes configuration yaml files
1. Let the team know they need to update their .env file(s) for local development

## Update the example.env file
In the repo, make sure the `example.env` file for the service or services using the environment
variable contains the update. Example: if adding `NEW_ENV_VAR` for the API, update `api/example.env`
and add `NEW_ENV_VAR=default`. Commit this to the repo as part of your PR.

## Update the 1password .env file
If the new environment variable will contain a secret, it needs to be added to 1password.
In the shared bonkeybong vault, find the `Portway Dev .env file` note and add the new env var
with the default secret for dev.

## Update the kubernetes configuration yaml files
To expose environment variables to Portway deployed environments, kubernetes needs to know about the
env vars. See `kubernetes/dev/api-deployment.yaml` and `kubernetes/dev/config.yaml` for examples.
If the env var is a secret, the secret needs to be added to the environments. There is no defined
process for setting secrets yet, so be sure to check with the team on how to do this.

## Communicate the update to the team
Make sure people know they need to update their local .env with the new value!