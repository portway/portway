# Setting up Digital Ocean Kubernetes

## Prerequisites

Create the following on Digital Ocean:
- Kubernetes Cluster
- Managed Postgres Database

## Setup the cluster

1. Install `doctl` and setup

- `brew install doctl`
[doctl/README.md at master · digitalocean/doctl · GitHub](https://github.com/digitalocean/doctl/blob/master/README.md#macos)
- Run `doctl auth init`
- Go to the Digital Ocean dashboard, and under “Manage” go to “API”
	- Generate a new Token
	- Copy it, it only shows up once!
- Paste the token into the `doctl` prompt

2. Get the kubernetes config to connect to the cluster
`doctl kubernetes cluster kubeconfig save example-cluster-01`
(Replace `example-cluster-01` with your cluster name)

3. Create the ingress nginx controller resources

Creates the ingress pod and configmaps:
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.24.1/deploy/mandatory.yaml
```

Creates the load balancer:
```
 kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.24.1/deploy/provider/cloud-generic.yaml
```

4. Add Docker registry secrets

This allows kubernetes to pull your docker images from the Docker Hub registry.

Create Docker Hub registry credential secret:
```
kubectl create secret docker-registry regcred —docker-server=<your-registry-server> —docker-username=<your-name> —docker-password=<your-pword> —docker-email=<your-email>
```

5. Add Helm

Create tiller user for cluster:
`kubectl -n kube-system create serviceaccount tiller`

Next, bind the **tiller** serviceaccount to the **cluster-admin** role:

```
kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
```

Now install Tiller:
```
helm init --service-account tiller
```

6. Add kubernetes dashboard

Install the chart:

```
helm install stable/kubernetes-dashboard --name dashboard --namespace=kube-system

helm upgrade dashboard stable/kubernetes-dashboard --set fullnameOverride="dashboard" --set rbac.clusterAdminRole=true
```

7. Setup the app

- Set all the kubernetes secrets with kubectl. See `kube-secrets-setup.md`
- Build images and push to Docker Hub repo

8. Setup DNS
 Set the DNS for the domains to point to the load balancer
`kubectl get svc --namespace=ingress-nginx`

Set the desired domains to have an A record pointing to the external IP returned by the above command.

9. Install cert-manager

Add Custom Resource Definitions:
```
	kubectl apply \
	    -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml
```

Add web hook magic for validation
```
	kubectl label namespace kube-system certmanager.k8s.io/disable-validation="true"
```

Add jetstack repo
```
helm repo add jetstack https://charts.jetstack.io
```

Install the chart:
```
helm install --name cert-manager --namespace kube-system jetstack/cert-manager --version v0.8.0
```

9. Deploy the app from the kubernetes yaml files

Notes:
- Update the domain names in the config to ensure they are correct
- Make sure the ingress yaml is set to use the letsencrypt-staging resource!
- Pay special attention to making sure the services are actually running! See cert-manager’s docs on ACME setup (link in Resources) for curl commands that _must_ return 200s before LetsEncrypt will issue certificates

## Viewing the Kubernetes Dashboard
Get the Tiller token secret:
```
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep -i "tiller-token-" |awk '{print $1;}') | grep -E 'token:/*' | cut -f2- -d:
```

get the pod name (find the one with “dashboard” in the name):
```
kubectl get pods -n=kube-system
```

Replace $POD_NAME with the pod name found in the previous step
```
kubectl -n kube-system port-forward $POD_NAME 8443:8443
```

Now open a browser and navigate to `https://127.0.0.1:8443` and bypass the security warning about the invalid cert

Choose the “Token” auth and paste the token from the first step

## Resources
**Resources**
[How To Install Software on Kubernetes Clusters with Helm | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-software-on-kubernetes-clusters-with-the-helm-package-manager)
Bug from above:
[stable/kubernetes-dashboard: User “system:serviceaccount:default:default” cannot create secrets in the namespace “kube-system” · Issue #3104 · helm/charts · GitHub](https://github.com/helm/charts/issues/3104)

[How to Set Up an Nginx Ingress with Cert-Manager on DigitalOcean Kubernetes | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)

[Installing on Kubernetes — cert-manager  documentation](https://cert-manager.readthedocs.io/en/latest/getting-started/install/kubernetes.html)

[Quick-Start using Cert-Manager with NGINX Ingress — cert-manager  documentation](https://cert-manager.readthedocs.io/en/latest/tutorials/acme/quick-start/index.html)

See comment at bottom of DO page from “deepinthought” about workaround, documented steps I took below combining comments from above

# Notes
Run API with docker-compose with custom command:
```
docker-compose run --no-deps api ./run.sh start
```

Web build for dev environment:
```
docker build -t bonkeybong/portway_web:dev2 -f web/Dockerfile-prod web/
```