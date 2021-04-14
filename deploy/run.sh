#!/bin/bash

NAME=budget-client
PUBLIC=public

cd "/var/www/${NAME}"

git pull origin master

docker build -t "${NAME}-image" \
  -f ./deploy/Dockerfile \
  .

docker run --name "${NAME}" \
  -d \
  "${NAME}-image"

rm -rf "${PUBLIC}/*"

docker cp "${NAME}":/usr/src/app/dist/. PUBLIC

docker rm -f "${NAME}"

cat "${PUBLIC}/meta.json"
