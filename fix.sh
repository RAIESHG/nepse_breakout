#!/bin/bash

echo "Fixing project structure..."

# Create directories
mkdir -p public
mkdir -p netlify/functions

# Clean up any existing files in public
rm -rf public/*

# Copy files to public directory
cp -v index.html public/ 2>/dev/null || echo "No index.html found"
cp -v app.js public/ 2>/dev/null || echo "No app.js found"
cp -v dataset.csv public/ 2>/dev/null || echo "No dataset.csv found"

# Verify files
echo -e "\nFiles in public directory:"
ls -la public/

# Clean up root directory
rm -f dataset*.csv
rm -f "dataset copy.csv"

# Add and commit
git add .
git commit -m "Fix file structure"
git push

echo -e "\nDone! Check the contents of public directory above." 