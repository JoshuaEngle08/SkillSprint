#!/usr/bin/env bash
set -e

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is required. Install it: https://cli.github.com/"
  exit 1
fi

read -p "Repository (owner/repo): " REPO
if [ -z "$REPO" ]; then
  echo "Repository is required."; exit 1
fi

read -p "OPENAI_API_KEY (paste): " -s OPENAI_API_KEY
echo
read -p "OPENAI_MODEL (default: gpt-4): " OPENAI_MODEL
OPENAI_MODEL=${OPENAI_MODEL:-gpt-4}
read -p "HEROKU_API_KEY (optional): " -s HEROKU_API_KEY
echo
read -p "HEROKU_APP_NAME (optional): " HEROKU_APP_NAME

# Set secrets
if [ -n "$OPENAI_API_KEY" ]; then
  echo "$OPENAI_API_KEY" | gh secret set OPENAI_API_KEY -R "$REPO"
  echo "Set OPENAI_API_KEY"
fi

if [ -n "$OPENAI_MODEL" ]; then
  echo "$OPENAI_MODEL" | gh secret set OPENAI_MODEL -R "$REPO"
  echo "Set OPENAI_MODEL"
fi

if [ -n "$HEROKU_API_KEY" ]; then
  echo "$HEROKU_API_KEY" | gh secret set HEROKU_API_KEY -R "$REPO"
  echo "Set HEROKU_API_KEY"
fi

if [ -n "$HEROKU_APP_NAME" ]; then
  echo "$HEROKU_APP_NAME" | gh secret set HEROKU_APP_NAME -R "$REPO"
  echo "Set HEROKU_APP_NAME"
fi

echo "Secrets configured. Remember to add any other secrets needed (e.g., dispatch tokens)."