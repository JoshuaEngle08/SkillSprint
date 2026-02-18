#!/usr/bin/env bash
set -e

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is required. Install it: https://cli.github.com/"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <repo-name> [visibility=public|private]"
  exit 1
fi

REPO_NAME="$1"
VISIBILITY="${2:-public}"

echo "Creating repo $REPO_NAME (visibility: $VISIBILITY) on your GitHub account..."

# Create remote repo
gh repo create "$REPO_NAME" --$VISIBILITY --confirm

# Initialize git and push
if [ ! -d ".git" ]; then
  git init
fi

git add -A
if git show-ref --quiet refs/heads/main; then
  git commit -m "Initial commit" || true
else
  git commit -m "Initial commit" || true
  git branch -M main
fi

# Get owner login
OWNER=$(gh api user --jq .login)
REMOTE_URL="https://github.com/$OWNER/$REPO_NAME.git"

if ! git remote | grep -q origin; then
  git remote add origin "$REMOTE_URL"
fi

echo "Pushing to $REMOTE_URL..."
git push -u origin main --force

echo "Repository created and pushed."
echo "To set secrets, run: scripts/set_secrets.sh or use 'gh secret set <NAME>'"