#!/bin/env sh

docker exec -it $(docker ps --format "{{.Names}}" | grep backend) npm run $1 $2c
