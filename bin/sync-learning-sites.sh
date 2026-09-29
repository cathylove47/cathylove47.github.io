#!/usr/bin/env bash
# 同步两个独立学习页面，避免 hexo deploy 覆盖 main 时丢失。
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

for site in pathology-atlas courses; do
  if [ "$site" = pathology-atlas ]; then
    BUILD_DIR=paper-reading-atlas/dist/static
  else
    BUILD_DIR=paper-reading-atlas/dist/courses
  fi
  mkdir -p public
  if [ -d "$BUILD_DIR" ]; then
    rm -rf "public/$site"
    cp -R "$BUILD_DIR" "public/$site"
    SRC="本地 $BUILD_DIR"
  else
    git fetch origin main --quiet
    git cat-file -e "origin/main:$site"
    rm -rf "public/$site"
    git archive origin/main "$site" | tar -x -C public
    SRC="远端 origin/main"
  fi
  echo "$site 已同步到 public/ (来源: $SRC)"
done
