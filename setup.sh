#!/bin/bash

# Create public directory if it doesn't exist
mkdir -p public

# Move main files to public directory
mv index.html app.js public/ 2>/dev/null || true

# Handle dataset.csv - move the original one to public
mv dataset.csv public/ 2>/dev/null || true

# Remove duplicate dataset files
rm "dataset copy.csv" 2>/dev/null || true
rm "netlify/functions/dataset copy.csv" 2>/dev/null || true
rm "netlify/functions/dataset.csv" 2>/dev/null || true

# List contents of public directory
echo "Contents of public directory:"
ls -la public/

# Add all changes to git
git add .
git commit -m "Organize files into public directory"
git push 