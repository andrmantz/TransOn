# fisman

* Need to run the below commands first:
```
helm repo add fission-charts https://fission.github.io/fission-charts/
helm repo update
```
### Required packages
* helm
* minikube
* kubectl
* fission

### Commands

* fisman start: Start minikube cluster with name `fis` and install fission.
* fisman stop: Stop the cluster
* fisman rm: Stop and delete the cluster
* fisman router: Print the fission router IP:PORT
* fisman clean: Delete all fission packages, environments, functions and routes in the cluster
* fisman status: Display cluster status
* fisman list: Display fission functions, routes, packages and environments.
