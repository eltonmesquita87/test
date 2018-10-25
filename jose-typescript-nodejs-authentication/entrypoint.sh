#!/usr/bin/env bash

npm run migrate

npm run webpack &

exec "$@"
