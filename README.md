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

确认页面正常后再发布：

```bash
npm run onekey
```

`npm run onekey` 会把生成结果发布到同一 GitHub 仓库的 `main` 分支。

旧文章已保存在 `legacy_posts/`，不会参与网站构建。
