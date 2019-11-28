# Kubernetes Secrets

Adding secrets is done manually to a cluster. You must connect locally to the cluster with `kubectl` and run the following commands, substituting appropriate `value`'s:

```
kubectl create secret generic token-secrets --from-literal=jwt_secret='value' --from-literal=password_reset='value'
```

```
kubectl create secret generic stripe-secrets --from-literal=secret='value' --from-literal=hook_secret='value'
```

```
kubectl create secret generic aws-secrets --from-literal=access_key_id='value' --from-literal=secret_access_key='value'
```

```
kubectl create secret generic db-secrets --from-literal=db_user_password='value'
```

```
kubectl create secret generic log-secrets --from-literal=log_token='value' --from-literal=audit_log_token='value'
```