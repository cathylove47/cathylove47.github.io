#!/usr/bin/env bash
# 从 main 分支把 pathology-atlas 构建产物同步到 public/,
# 使 hexo deploy 时论文精读功能不丢失。
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ -d paper-reading-atlas/dist/static ]; then
  # 博客目录内的论文仓库已完成静态构建，优先使用本地最新结果
  mkdir -p public
  rm -rf public/pathology-atlas
  cp -R paper-reading-atlas/dist/static public/pathology-atlas
  SRC="本地子模块 paper-reading-atlas/dist/static"
else
  git fetch origin main --quiet
  mkdir -p public
  rm -rf public/pathology-atlas
  git archive origin/main pathology-atlas | tar -x -C public
  SRC="远端 origin/main"
fi
echo "pathology-atlas 已同步到 public/ (来源: $SRC, $(find public/pathology-atlas -type f | wc -l | tr -d ' ') 个文件)"
