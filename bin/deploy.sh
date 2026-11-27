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
echo "生成博客页面"
NODE_ENV=production npx hexo generate
echo "同步论文精读与课程资料独立页面"
bash bin/sync-learning-sites.sh
echo "部署到 VPS（主站，rsync 后立即生效）"
VPS_HOST="${VPS_HOST:-root@100.70.90.39}"
VPS_PORT="${VPS_PORT:-19590}"
VPS_KEY="${VPS_KEY:-$HOME/.ssh/vps_mac_ed25519}"
rsync -az --delete --exclude CNAME \
  -e "ssh -p $VPS_PORT -i $VPS_KEY -o IdentitiesOnly=yes -o BatchMode=yes" \
  public/ "$VPS_HOST:/var/www/cathy47.party/"
echo "部署到 GitHub Pages（备份）"
npx hexo deploy
echo "部署完成"