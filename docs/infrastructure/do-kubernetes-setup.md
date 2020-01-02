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
kubectl create secret docker-registry regcred --docker-server=DOCKER_SERVER --docker-username=DOCKER_USERNAME --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
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
**Note** If using Kubernetes 1.16.x and an older Helm client (as of 12/6/19) follow these instructions to initialize Tiller correctly: [Fix Helm Init](https://github.com/helm/helm/issues/6374#issuecomment-533185074)

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

Set the desired domains to have an A record pointing to the external IP returned by the above command. There should be two DNS records: one for the web app, and one for the API (example: `dev.portway.app` and `api.dev.portway.app` respectively)

9. Deploy the app using the helm chart

`helm install --name portway ./kubernetes/helm/portway`
To use a different yaml file:
`helm install -f ./kubernetes/helm/portway/prodValues.yaml --name portway ./kubernetes/helm/portway`

Notes:
- Make sure all the values.yaml values are correct!
- Make sure the ingress yaml is set to use the letsencrypt-staging resource!
- Pay special attention to making sure the services are actually running! See cert-manager’s docs on ACME setup (link in Resources) for curl commands that _must_ return 200s before LetsEncrypt will issue certificates

10. Install cert-manager for SSL

Follow the latest docs from [cert-manager](https://cert-manager.io/docs/tutorials/acme/ingress/)
The process is a bit complicated, but the key is to ensure the app services are running in the cluster and responding at the domain root with a 200.

Note the letsencrypt issuers are configured in `kubernetes/letsencrypt`, so those can be applied to the cluster and used in the instructions from cert-manager. The Portway Helm Chart is configured to allow setting the certIssuer to `letsencrypt-staging` and `letsencrypt-prod` to utilize the two issuers.

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