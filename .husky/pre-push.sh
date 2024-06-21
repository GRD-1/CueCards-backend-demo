#!/bin/bash

echo "e2e testing..."
(npm run test:e2e 1> /dev/null) || (echo "e2e testing failed!"; exit 1)
echo "e2e testing successful!"
