# Useful Things with Kubernetes and Docker

## Expose a Kubernetes Service to local Docker

1. Connect to the desired kubernetes cluster with kubectl
```
kubectl config get-contexts
kubectl config use-context [context name]
```

2. Find and expose the service
```
kubectl get services
kubectl port-forward svc/[service name] [local port]:[service port]
// eg: kubectl port-forward svc/redis-service 7000:6379
```

3. Connect to the service with Docker
Docker exposes the magic `host.docker.internal` inside containers. Using this url, we can connect to port 7000 on localhost in a locally running Docker container.  
In the appropriate `.env` file (or wherever you can set an env var): `REDIS_URL=host.docker.internal:7000`  
Now running the docker container will allow it to connect to the Kubernetes service!