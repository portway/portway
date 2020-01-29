# Kubernetes Secrets

Adding secrets is done manually to a cluster. You must connect locally to the cluster with `kubectl` and run the following commands, substituting appropriate `value`'s:

Token secrets
```
kubectl create secret generic token-secrets --from-literal=jwt_secret='value' --from-literal=password_reset='value'
```

Stripe secrets
```
kubectl create secret generic stripe-secrets --from-literal=secret='value' --from-literal=hook_secret='value'
```

AWS secrets
```
kubectl create secret generic aws-secrets --from-literal=access_key_id='value' --from-literal=secret_access_key='value'
```

Database secrets
```
kubectl create secret generic db-secrets --from-literal=db_user_password='value'
```

Log secrets
```
kubectl create secret generic log-secrets --from-literal=log_token='value' --from-literal=audit_log_token='value' --from-literal=log_token_web='value'
```

Admin secrets
```
kubectl create secret generic admin-secrets --from-literal=admin_secret_key='value'
```

Zendesk secrets
```
kubectl create secret generic zendesk-secrets --from-literal=token='value'
```

Audit Log Backup secrets
These are only needed if the audit log should get backed up in the environment and the audit log backup job is running
```
kubectl create secret generic audit-log-backup --from-literal=access_key_id='value' --from-literal=secret_access_key='value' --from-literal=api_key='value' --from-literal=log_id='value'
```