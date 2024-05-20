Dapr -  Distributed Application Runtime
===

Dapr is a portable, event-driven runtime that makes it easy for any developer to build resilient, stateless, and stateful applications

![overview-sidecar-model](./overview-sidecar-model.png)


## Local Setup/Build

```bash
docker build -t productsapi:latest .
```


Before you continue, YAML file with secrets expects value of `YOUR_CUSTOMERS_API_KEY_BASE64` or `BASE64_ENCODED_DEVICES_API_KEY` aka `data.api-key` to be base64 value otherwise you will end up with:

> Error from server (BadRequest): error when creating "k8s-secrets.yaml": Secret in version "v1" cannot be handled as a Secret: illegal base64 data at input byte 4

So you need to base64-fy any value you use for actual api-key, for example:

```bash
echo -n 'andrii' | base64
```

```bash
kubectl apply -f k8s-secrets.yaml
kubectl apply -f k8s-deployment.yaml
kubectl get pods
```

```bash
docker run --name productsapi-container -p 3000:3000 productsapi:latest dapr run --app-id productsapi --app-port 3000 node index.js
```

## Setup with remote Docker Hub deployment and GitHub Actions

```bash
docker build -t your-dockerhub-username/productsapi .
docker push your-dockerhub-username/productsapi
```

```bash
kubectl apply -f k8s-secrets.yaml
kubectl apply -f k8s-deployment.yaml
kubectl get pods
```
