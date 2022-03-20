#!/bin/sh

# Build frontend
cd app 2>/dev/null

if [ $? -ne 0 ]; then 
	echo "Please run in project root directory"
	exit 1
fi

npm install >/dev/null 2>&1
npm run build >/dev/null 2>&1
zip -r ../frontend-source.zip . >/dev/null
cd ..


fission env create --spec --name nodejs --image fission/node-env --version 2
fission package create --spec --deploy frontend-source.zip --env nodejs --name frontend-source
fission fn create --spec --name frontend --pkgname frontend-source --entrypoint "app" --env nodejs
fission route create --spec --name transon --method GET --prefix /transon --function frontend --keepprefix
