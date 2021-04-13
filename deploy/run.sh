#!/bin/bash

cd /var/www/budget-client
git pull origin master
docker build -t "budget-client-image" -f ./deploy/Dockerfile .
docker run --name "budget-client" -d "budget-client-image"
