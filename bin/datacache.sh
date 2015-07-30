#!/bin/sh

# Remove old cached data
rm public/dist/data.json

# Rebuild new data
curl http://zyu.me:1337/data/rebuild
echo ""

# Download new data
curl http://zyu.me:1337/data > public/dist/data.json
