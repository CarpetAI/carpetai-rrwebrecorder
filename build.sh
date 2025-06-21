#!/bin/bash

echo "Building Session Recorder package..."

# Install dependencies
npm install

# Clean previous build
npm run clean

# Build the package
npm run build

echo "Build complete! Check the dist/ folder for output files." 