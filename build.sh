#!/bin/sh
echo "Starting environmental variable initialization.."
sleep 0.5

echo -ne "\e[1A\e[KPostgres Root User Name: admin"
sleep 0.3
echo
echo -ne "\e[1A\e[KPostgres User Password: "
read -s pgpassword
echo

echo -ne "\e[1A\e[KMinio Root User Name: admin"
sleep 0.3
echo
echo -ne "\e[1A\e[KMinio Root User Password: "
read -s mnpassword
echo

echo -ne "\e[1A\e[KJWT Secret Key: "
read -s jwtpassword
echo -e "\e[1A\e[K"
echo

kubectl create secret generic sensitive-data --from-literal PGUSER=admin --from-literal PGPASSWORD=$pgpassword --from-literal MNUSER=admin --from-literal MNPASSWORD=$mnpassword >/dev/null
kubectl -n fission-function create secret generic sensitive-data --from-literal PGUSER=admin --from-literal PGPASSWORD=$pgpassword --from-literal MNUSER=admin --from-literal MNPASSWORD=$mnpassword --from-literal JWTPASSWORD=$jwtpassword >/dev/null

# Apply cluster configurations
[ -d "k8s" ] || ( echo "Please run in project root directory" && exit 1 ) 
kubectl apply -f k8s/  1>/dev/null

echo -e "\e[1A\e[KZipping files..."
cd app >/dev/null
npm install >/dev/null 2>&1
npm run build >/dev/null 2>&1
zip -r ../frontend-source.zip . >/dev/null

cd ..

zip -jr api-source.zip api/. >/dev/null

echo -e "\e[1A\e[KBuilding...."
fission spec apply 1>/dev/null

echo -e "\e[1A\e[KRemoving uneeded files..."

# Cleanup
rm -rf frontend-source.zip api-source.zip app/node_modules app/.next

echo -ne "\e[1A\e[K"
echo "[+] Done"
x=$(minikube ip)
echo "Be sure to enable ingress in minikube cluster, if you haven't already, with: 'minikube addons enable ingress'"
echo [*] Frontend at: http://$x/
echo [*] Minio console at: http://$x:31111 
