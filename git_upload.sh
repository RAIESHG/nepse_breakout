#!/bin/bash


# Add all files
git add .

# Commit changes
git commit -m "Update $(date)"

# Push to main branch
git push origin main