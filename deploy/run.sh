#!/bin/bash

NAME=budget-client

cd "/var/www/${NAME}"

git pull origin master

docker build -t "${NAME}-image" \
  -f ./deploy/Dockerfile \
  .

docker run --name "${NAME}" \
  -d \
  "${NAME}-image"

rm -rf public
mkdir public

docker cp "${NAME}":/usr/src/app/dist/. ./public

docker rm -f "${NAME}"

cat ./public/meta.json
