#!/bin/bash

echo "=== Current Directory Structure ==="
find . -type f -not -path "*/\.*" -not -path "*/node_modules/*"

echo -e "\n=== Contents of public directory ==="
ls -la public/

echo -e "\n=== Contents of netlify/functions ==="
ls -la netlify/functions/ 