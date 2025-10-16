#!/bin/bash

# Setup builds linking for Snowman documentation
# This script sets up the worktrees and symbolic links for the first time

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREES_DIR="$SCRIPT_DIR/../worktrees"
BUILDS_DIR="$SCRIPT_DIR/builds"

echo "Setting up Snowman build file linking..."

# Create worktrees directory if it doesn't exist
mkdir -p "$WORKTREES_DIR"

# Create or update worktrees for each branch
echo "Creating worktrees..."

# Remove existing worktrees if they exist
if [ -d "$WORKTREES_DIR/1.X" ]; then
    echo "  Removing existing 1.X worktree..."
    git worktree remove "$WORKTREES_DIR/1.X" --force 2>/dev/null || true
fi

if [ -d "$WORKTREES_DIR/2.X" ]; then
    echo "  Removing existing 2.X worktree..."
    git worktree remove "$WORKTREES_DIR/2.X" --force 2>/dev/null || true
fi

if [ -d "$WORKTREES_DIR/main" ]; then
    echo "  Removing existing main worktree..."
    git worktree remove "$WORKTREES_DIR/main" --force 2>/dev/null || true
fi

# Create fresh worktrees
echo "  Creating 1.X worktree..."
git worktree add "$WORKTREES_DIR/1.X" 1.X

echo "  Creating 2.X worktree..."
git worktree add "$WORKTREES_DIR/2.X" 2.X

echo "  Creating main worktree..."
git worktree add "$WORKTREES_DIR/main" main

# Create builds directory if it doesn't exist
mkdir -p "$BUILDS_DIR"

# Remove existing symbolic links or directories
echo "Setting up build directories..."
rm -rf "$BUILDS_DIR/1.X" "$BUILDS_DIR/2.X" "$BUILDS_DIR/3.X"

# Create build directories
mkdir -p "$BUILDS_DIR/1.X" "$BUILDS_DIR/2.X" "$BUILDS_DIR/3.X"

# Copy files from worktrees instead of using symbolic links (GitHub Pages compatible)
echo "Copying build files..."
cp "$WORKTREES_DIR/1.X/dist/"* "$BUILDS_DIR/1.X/" 2>/dev/null || echo "No files to copy from 1.X"
cp "$WORKTREES_DIR/2.X/dist/"* "$BUILDS_DIR/2.X/" 2>/dev/null || echo "No files to copy from 2.X"  
cp "$WORKTREES_DIR/main/dist/"* "$BUILDS_DIR/3.X/" 2>/dev/null || echo "No files to copy from main"

echo "Setup complete!"
echo ""
echo "Build files are now linked:"
echo "  - builds/1.X/ → ../worktrees/1.X/dist/"
echo "  - builds/2.X/ → ../worktrees/2.X/dist/"
echo "  - builds/3.X/ → ../worktrees/main/dist/"
echo ""
echo "To update all builds with latest changes, run:"
echo "  ./update-builds.sh"