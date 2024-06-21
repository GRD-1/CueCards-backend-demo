#!/bin/bash

echo "Formatting..."
(npm run format 1> /dev/null) || (echo "Formatting failed!"; exit 1)
echo "Formatting successful!"

echo "Linting..."
(npm run lint:only-errors) || (echo "Linting failed!"; exit 1)
echo "Linting successful!"

echo "Building..."
(npm run build 1> /dev/null) || (echo "Build failed!"; exit 1)
echo "Build successful!"
