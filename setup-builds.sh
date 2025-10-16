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

# Remove existing symbolic links
echo "Setting up symbolic links..."
rm -f "$BUILDS_DIR/1.X" "$BUILDS_DIR/2.X" "$BUILDS_DIR/3.X"

# Create relative symbolic links
cd "$BUILDS_DIR"
ln -s ../../worktrees/1.X/dist 1.X
ln -s ../../worktrees/2.X/dist 2.X
ln -s ../../worktrees/main/dist 3.X

echo "Setup complete!"
echo ""
echo "Build files are now linked:"
echo "  - builds/1.X/ → ../worktrees/1.X/dist/"
echo "  - builds/2.X/ → ../worktrees/2.X/dist/"
echo "  - builds/3.X/ → ../worktrees/main/dist/"
echo ""
echo "To update all builds with latest changes, run:"
echo "  ./update-builds.sh"