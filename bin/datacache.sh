#!/bin/sh

# Remove old cached data
rm tmp/data.json

# Rebuild new data
curl http://localhost:1337/data/rebuild
echo ""

# Download new data
curl http://localhost:1337/data > tmp/data.json
