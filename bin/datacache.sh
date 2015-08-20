#!/bin/sh

# Remove old cached data
echo "Deleting old DATA file if present..."
rm tmp/data.json

# Rebuild new data
echo "Rebuilding data from CMS Spreadsheet using Local Server..."
curl -ss http://localhost:1337/data/rebuild

# Download new data
echo "\nDownloading data from Local Server to Disk..."
curl -ss http://localhost:1337/data > tmp/data.json
