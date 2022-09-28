# frinx-machine-e2e-tests

This repository contains e2e tests for frinx-machine helm-chart

## Prerequisites
- Kubernetes 1.19+
- Helm 3.2.0+
- Kubernetes cluster(e.g. minikube, kind, ...)

## Testing steps

1. Install frinx-machine in your environment e.g
```bash
helm repo add frinx https://FRINXio.github.io/helm-charts
helm install frinx-machine frinx/frinx-machine --set demo-workflows.enabled=true -n frinx-e2e --create-namespace
```
You can check if frinx-machine is ready with command
```bash
kubectl get pods -n frinx-e2e
```
2. Install the testing tool

    a) Install cypress using [npm](https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download)

    b) Install [testkube](https://kubeshop.github.io/testkube/installing/)

Testkube tool(just once)
```bash
wget -qO - https://repo.testkube.io/key.pub | sudo apt-key add -
echo "deb https://repo.testkube.io/linux linux main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install -y testkube
```
Installation of testkube into cluster
```bash
kubectl create namespace cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.crds.yaml
helm repo add jetstack https://charts.jetstack.io
helm install my-release --namespace cert-manager --version v1.9.1 jetstack/cert-manager
helm repo add testkube https://kubeshop.github.io/helm-charts
helm install --create-namespace --namespace testkube --version 1.4.5 testkube testkube/testkube
```

3. Run the tests

For npm
```bash
kubectl port-forward svc/krakend 8080:8080
npx cypress run --env host=localhost:8080
```

For testkube
```bash
kubectl testkube create test --git-uri https://github.com/FRINXio/frinx-machine-e2e-tests.git --git-branch main --name frinx-e2e --type cypress/project
kubectl testkube run test frinx-e2e -f
```
