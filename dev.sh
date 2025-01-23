#!/bin/bash

# Ensure files are in root for local development
cp -r public/* . 2>/dev/null

# Start the server
npm start 