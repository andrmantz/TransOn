#!/bin/sh
rm -rf api-source.zip
zip -jr api-source.zip api/.

fission env create --spec --name python --image fission/python-env:latest --builder fission/python-builder:latest --version 3

fission package create --spec --name api-src --sourcearchive api-source.zip --env python --buildcmd "./build.sh"

fission fn create --spec --name login --pkg api-src --entrypoint "app.login" --env python
fission fn create --spec --name register --pkg api-src --entrypoint "app.register" --env python
fission fn create --spec --name upload --pkg api-src --entrypoint "app.upd" --env python
fission fn create --spec --name deleteaccount --pkg api-src --entrypoint "app.deleteAccount" --env python
fission fn create --spec --name view --pkg api-src --entrypoint "app.openLink" --env python
fission fn create --spec --name download --pkg api-src --entrypoint "app.download" --env python
fission fn create --spec --name deleteoldfiles --pkg api-src --entrypoint "app.deleteOldFiles" --env python


fission route create --spec --name login --function login --method POST --url /login
fission route create --spec --name register --function register --method POST --url /register
fission route create --spec --name upload --function upload --method POST --url /upload
fission route create --spec --name deleteaccount --function deleteaccount --method DELETE --url /delete_account
fission route create --spec --name view --function view --method GET --url /view
fission route create --spec --name download --function download --method GET --url /download
fission timer create --spec --name deleteoldfiles --function deleteoldfiles --cron "@daily"