#!/bin/sh

rm firefoxos.zip
cd public
zip -r firefoxos.zip . -x ".*" -x "*/.*" -x "scripts/*" -x "styles/*" -x "favicon.ico"
mv firefoxos.zip ../firefoxos.zip
cd ..
