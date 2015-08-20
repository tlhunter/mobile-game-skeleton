#!/bin/sh

# Remove old cached data
echo "Deleting old DATA file if present..."

rm tmp/data.json

echo "Rebuilding data from CMS Spreadsheet using Local Server..."

# Rebuild new data
curl -ss http://localhost:1337/data/rebuild

echo "\nDownloading data from Local Server to Disk..."

# Download new data
curl -ss http://localhost:1337/data > tmp/data.json
