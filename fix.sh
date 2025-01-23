#!/bin/bash

echo "Fixing project structure..."

# Create directories
mkdir -p public
mkdir -p netlify/functions

# Copy files to both root (for local dev) and public (for Netlify)
for file in index.html app.js dataset.csv; do
    # Copy to public for Netlify
    cp -v $file public/ 2>/dev/null || echo "No $file found"
    # Keep in root for local development
    cp -v $file . 2>/dev/null || echo "No $file found"
done

# Verify files
echo -e "\nFiles in public directory:"
ls -la public/
echo -e "\nFiles in root directory:"
ls -la *.{html,js,csv} 2>/dev/null

# Clean up duplicate dataset files
rm -f "dataset copy.csv"
rm -f "dataset copy"*.csv

# Add and commit
git add .
git commit -m "Fix file structure"
git push

echo -e "\nDone! Check the contents of directories above." 