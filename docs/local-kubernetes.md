# Running Kubernetes Locally

Requirements:
- Docker
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

1. Start Minikube: `minikube start`
1. Switch to Minikube's docker: `eval $(minikube docker-env)`
    _Note:_ This only switches docker in the context of your current shell! It's not system-wide!
1. Enable Minikube's `ingress` addons: `minikube addons enable ingress`
1. Create Kubernetes secrets. In the shared 1password vault, run each `kubectl create secret` command
1. Build the images, from the repo root: `make build`
1. Apply the kubernetes configuration: `kubectl create -f kubernetes/dev/ --save-config`
   If you've already applied the config in the past, run: `kubectl apply -f kubernetes/dev/`
1. Run `minikube ip` to get the cluster's IP address
1. Update your `/etc/hosts` file to add the following lines, where the IP is the address found
in the previous step:
```
192.168.99.100 portway.local
192.168.99.100 api.portway.local
```

Now you can navigate to `portway.local` to access the kubernetes cluster!