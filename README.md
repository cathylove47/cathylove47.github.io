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

部署脚本 `bin/sync-learning-sites.sh` 分别同步两个独立栏目：论文精读使用 `paper-reading-atlas/dist/static/`，发布到 `/pathology-atlas/`；课程资料使用 `paper-reading-atlas/dist/courses/`，发布到 `/courses/`。某一栏目本地尚未构建时，继续使用博客 `main` 分支中该栏目的已有产物。

`npm run onekey` 会把生成结果发布到同一 GitHub 仓库的 `main` 分支。

两套静态产物同时保存在 `source/pathology-atlas/` 和 `source/courses/`，由 Hexo `skip_render` 原样复制。博客导航在 `_config.fluid.yml` 中分别配置「论文精读」和「课程资料」。课程页不依赖论文阅读器，不共享其主题存储；当前根路径没有首页，课程页「返回博客」指向 `/about/`。

课程资料的内容和渲染源码保存在 `paper-reading-atlas/` 子模块。新增资料后单独构建：

```bash
cd paper-reading-atlas
npm run build:courses
cd ..
npm run onekey
```

课程构建不会携带论文文件；原始附件放在子模块的 `course-site/public/<课程 ID>/`，课程目录和 Markdown 正文登记在 `lib/courses.ts`。

旧文章已保存在 `legacy_posts/`，不会参与网站构建。
