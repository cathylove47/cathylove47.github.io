# Cathy 的 Hexo 博客

博客使用 Hexo 和 Fluid 主题构建，并通过 GitHub Pages 发布到：

- <https://www.cathy47.online/>

## 分支约定

- `source`：保存 Hexo 配置、主题和 Markdown 源码。
- `main`：保存 `hexo deploy` 生成的静态网站，由 GitHub Pages 托管。

## 本地使用

```bash
npm install
npm run server
```

新文章放在 `source/_posts/` 中。保存源码时使用：

```bash
git add -A
git commit -m "post: 文章标题"
git push origin source
```
生成静态网站：

```bash
npm run clean
npm run build
```

论文精读地图源码位于博客目录下的 `paper-reading-atlas/` Git 子模块。首次配置或在新电脑上使用时：

```bash
git submodule update --init --recursive
cd paper-reading-atlas
pnpm install --frozen-lockfile
pnpm build:static
cd ..
```

完成论文内容修改后，先在子模块中提交并推送；然后回到博客仓库提交子模块指针：

```bash
git -C paper-reading-atlas add .
git -C paper-reading-atlas commit -m "update reading notes"
git -C paper-reading-atlas push
git add paper-reading-atlas
```

确认页面正常后发布：

```bash
npm run onekey
```

部署脚本会优先使用 `paper-reading-atlas/dist/static/` 的本地构建结果，同步到网站的 `/pathology-atlas/`；如果本地尚未构建，则继续使用博客 `main` 分支中已有的构建产物。

`npm run onekey` 会把生成结果发布到同一 GitHub 仓库的 `main` 分支。

论文精读站点源码在 `source/pathology-atlas/`，由 Hexo `skip_render` 原样拷贝到 `/pathology-atlas/`。不要把这套静态文件只放在 `main` 分支：`hexo deploy` 会覆盖 `main`。

旧文章已保存在 `legacy_posts/`，不会参与网站构建。
