# Kubernetes Job Setup

This one is pretty easy:
`kubectl create -f kubernetes/jobs`

Jobs are _not_ automatically deployed to the cluster, they are not part of the Portway helm chart!

If you update any job config, you will need to reapply the changes manually:
`kubectl apply -f kubernetes/jobs`