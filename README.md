# frinx-machine-e2e-tests

This repository contains e2e tests for frinx-machine helm-chart

## Prerequisites:
- Kubernetes 1.19+
- Helm 3.2.0+
- Kubernetes cluster(e.g. minikube, kind, ...)

## Testing steps:

1. Install frinx-machine in your environment e.g
```
helm repo add frinx https://FRINXio.github.io/helm-charts
helm install frinx-machine frinx/frinx-machine --set demo-workflows.enabled=true
```
2. Install the testing tool

    a) Install cypress using [npm](https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download)

    b) Install [testkube](https://kubeshop.github.io/testkube/installing/)

3. Run the tests

For npm
```
kubectl port-forward svc/krakend 8080:80
npm install
npx cypress run --env host=localhost:8080
```

For testkube
```
kubectl testkube create test --git-uri https://github.com/FRINXio/frinx-machine-e2e-tests.git --git-branch main --name frinx-e2e --type cypress/project
npm install
kubectl testkube run test frinx-e2e -f
```
