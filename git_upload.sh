#!/bin/bash

# Ensure public directory exists
mkdir -p public

# Add all files
git add .

# Commit changes
git commit -m "Update $(date)"

# Push to main branch
git push