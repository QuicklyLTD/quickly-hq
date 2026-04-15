#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ENV_FILE="${DEPLOY_ENV_FILE:-$ROOT_DIR/.deploy.env}"

if [[ -f "$DEPLOY_ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$DEPLOY_ENV_FILE"
fi

: "${FTP_HOST:?FTP_HOST is required}"
: "${FTP_USER:?FTP_USER is required}"
: "${FTP_PASS:?FTP_PASS is required}"

FTP_PORT="${FTP_PORT:-21}"
FTP_REMOTE_DIR="${FTP_REMOTE_DIR:-/hq.quickly.host}"
DEPLOY_PACKAGE_JSON="${DEPLOY_PACKAGE_JSON:-1}"
DEPLOY_WEB_CONFIG="${DEPLOY_WEB_CONFIG:-0}"
DEPLOY_RUNNER_SCRIPT="${DEPLOY_RUNNER_SCRIPT:-0}"
DEPLOY_TASK_SETUP_SCRIPT="${DEPLOY_TASK_SETUP_SCRIPT:-0}"

if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp is required for deploy:ftps" >&2
  exit 1
fi

cd "$ROOT_DIR"

lftp <<LFTP_CMDS
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set ftp:use-site-chmod false
set ssl:verify-certificate no
open -u "$FTP_USER","$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST"
mkdir -p "$FTP_REMOTE_DIR"
cd "$FTP_REMOTE_DIR"
mirror -R --verbose --no-perms --exclude-glob .DS_Store --exclude-glob access.log ./dist ./dist
$(if [[ "$DEPLOY_PACKAGE_JSON" == "1" ]]; then printf '%s\n' 'put -O . ./package.json'; fi)
$(if [[ "$DEPLOY_WEB_CONFIG" == "1" ]]; then printf '%s\n' 'put -O . ./web.config.deploy -o web.config'; fi)
$(if [[ "$DEPLOY_RUNNER_SCRIPT" == "1" ]]; then printf '%s\n' 'put -O . ./run-quickly-hq.ps1'; fi)
$(if [[ "$DEPLOY_TASK_SETUP_SCRIPT" == "1" ]]; then printf '%s\n' 'put -O . ./setup-quickly-hq-task.ps1'; fi)
bye
LFTP_CMDS

echo "FTPS deploy completed: $FTP_HOST$FTP_REMOTE_DIR"
