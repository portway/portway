# Renew Letsencrypt Certificates

Force letsencrypt to re-issue new certificates for Portway

1. Connect kubectl to the desired k8s cluster

```bash
kubectl config get-contexts
kubectl config use-context [context]
```

2. Checkout the appropriate git branch or commit
The appropriate branch is the one that has the correct kubernetes config for the k8s cluster. Usually this will be release, but if a new feature with updated kubectl config is in release but hasn't been deployed to the cluster, it may be an earlier commit. To find out what release is on an environment, look at the `main` branch and in `deploys/[env].txt` which contains deployed release tag. Then checkout that tag: `git checkout 0.13.1`

3. Manually update the appropriate values.yml file
For dev, this is `kubernetes/helm/portway/values.yaml`
For prod, this is `kubernetes/helm/portway/prodValues.yaml`

Set the `certIssuer` to `letsencrypt-staging`
Set the appropriate release tag for the various images (web, api, docs)

4. Run a helm upgrade
**Note** This will take down the environment, the staging issuer for letsencrypt won't issue a valid cert

`helm upgrade portway ./kubernetes/helm/portway --values ./kubernetes/helm/[value].yaml` where `[value]` is the values yaml file associated with the environment.

5. Delete the staging secret

`kubectl delete secrets letsencrypt-staging-cert`
Now watch for the cert to get re-issued: `kubectl get certificate`. Run this command until the cert has been issue (ready status = true)

6. Delete the prod secret
`kubectl delete secrets letsencrypt-prod-cert`

7. Change the issuer back to prod, via helm upgrade
- Change the appropriate values yaml file back to `certIssuer: letsencrypt-prod`
- `helm upgrade portway ./kubernetes/helm/portway --values ./kubernetes/helm/[value].yaml`

8. Success
You can watch `kubectl get certificate` to see the prod cert get issued, and the environment should be live again.

There is no need to commit any changes in the values.yaml file(s)
