#!/bin/bash

# Script to compile all .twee files in test/e2e to .html files using ExTwee
# This fixes the broken e2e tests by generating the required HTML files

set -e  # Exit on any error

echo "🔄 Compiling all e2e test files..."

# Check if dist/format.js exists
if [ ! -f "dist/format.js" ]; then
    echo "❌ Error: dist/format.js not found. Run 'npm run package' first."
    exit 1
fi

# Check if extwee is available
if ! command -v extwee &> /dev/null; then
    echo "❌ Error: extwee command not found. Install it with 'npm install -g extwee'."
    exit 1
fi

echo "✅ Using extwee version: $(extwee --version)"
echo "✅ Format file: dist/format.js ($(stat -f%z dist/format.js 2>/dev/null || stat -c%s dist/format.js) bytes)"

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
        exit 1
    fi
done

echo "🎉 Batch compilation complete!"