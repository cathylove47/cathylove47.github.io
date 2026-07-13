#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "git 未安装" && exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 未安装" && exit 1
fi
if ! command -v npx >/dev/null 2>&1; then
  echo "npm 未安装" && exit 1
fi

echo "开始清理"
npx hexo clean
echo "开始生成"
NODE_ENV=production npx hexo generate
echo "开始部署"
npx hexo deploy
echo "部署完成"