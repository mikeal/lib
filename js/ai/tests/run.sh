#!/bin/sh

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Run tests using the script directory as a base for relative paths
deno test --fail-fast --allow-net --allow-env "$SCRIPT_DIR/test-openai-api.js"
deno test --fail-fast --allow-run --allow-read "$SCRIPT_DIR/test-deno-sources.js"

