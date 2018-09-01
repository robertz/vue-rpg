#!/bin/bash
yarn run build
cp now.json dist
cd dist
now && now alias && now rm vue-rpg --safe --yes
cd ..
