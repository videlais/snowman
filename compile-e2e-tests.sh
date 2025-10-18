#!/bin/bash

# Script to compile all .twee files in test/e2e to .html files using ExTwee
# This fixes the broken e2e tests by generating the required HTML files

echo "🔄 Compiling all e2e test files..."

# Find all .twee files in test/e2e and compile them
find test/e2e -name "*.twee" -type f | while read -r twee_file; do
    # Get the directory and base name
    dir=$(dirname "$twee_file")
    base=$(basename "$twee_file" .twee)
    html_file="$dir/$base.html"
    
    echo "Compiling: $twee_file -> $html_file"
    
    # Compile with ExTwee
    if extwee -c -s dist/format.js -i "$twee_file" -o "$html_file"; then
        echo "✅ Successfully compiled $twee_file"
    else
        echo "❌ Failed to compile $twee_file"
    fi
done

echo "🎉 Batch compilation complete!"