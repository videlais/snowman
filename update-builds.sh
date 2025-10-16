#!/bin/bash

# Update builds script for Snowman documentation
# This script pulls the latest changes for each worktree branch

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREES_DIR="$SCRIPT_DIR/../worktrees"

echo "Updating Snowman build files..."

# Update 1.X branch
echo "Updating 1.X branch..."
cd "$WORKTREES_DIR/1.X"
git pull origin 1.X

# Update 2.X branch  
echo "Updating 2.X branch..."
cd "$WORKTREES_DIR/2.X"
git pull origin 2.X

# Update main branch (3.X)
echo "Updating main branch..."
cd "$WORKTREES_DIR/main"
git pull origin main

echo "All build files updated!"
echo "Files are now available at:"
echo "  - builds/1.X/ (linked to 1.X branch dist/)"
echo "  - builds/2.X/ (linked to 2.X branch dist/)"
echo "  - builds/3.X/ (linked to main branch dist/)"