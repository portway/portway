# Helm Usage

The app is deployed as a Helm Chart to a Kubernetes cluster. For specifics on Kubernetes, see the "do-kubernetes-setup.md" doc.

## Portway Chart

The Portway Chart source is found in `kubernetes/helm/portway`

## Development

After making changes to the chart, make sure the chart still compiles:
```
helm install --dry-run --debug ./kubernetes/helm/portway
```

## Deployment
```
helm install --name portway ./kubernetes/helm/portway
```

Now to update values, can change them in `values.yaml` in `portway/values.yaml` 
or use the `--set` flag:

```
helm upgrade --set apiTag=v120.0.2 portway ./portway
```
