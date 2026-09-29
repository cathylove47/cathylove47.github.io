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

两套静态产物同时保存在 `source/pathology-atlas/` 和 `source/courses/`，由 Hexo `skip_render` 原样复制。博客导航在 `_config.fluid.yml` 中分别配置「论文精读」和「课程资料」。课程页不依赖论文阅读器，不共享其主题存储；两个栏目顶部均有「返回博客」按钮，直接回到 `/` 首页。

「课程资料」栏目定位为 408 讲题资料库，按四科组织题目与知识点，答案与解析默认折叠。内容和渲染源码保存在 `paper-reading-atlas/` 子模块。新增资料后单独构建：

```bash
cd paper-reading-atlas
npm run build:courses
cd ..
npm run onekey
```

课程构建不会携带论文文件；原始附件放在子模块的 `course-site/public/<资料 ID>/`，四科分类、题目正文、标签及独立的 `solution` 解析登记在 `lib/courses.ts`。不要在题面或摘要中提前透露答案，也不要添加示例内容充数。

旧文章已保存在 `legacy_posts/`，不会参与网站构建。

## 无文章时的首页

Fluid 的首页生成器在文章集合为空时仍生成根路径页面，显示欢迎信息及「课程资料」「论文精读」入口；不需要恢复 `legacy_posts/` 或创建虚构文章。存在文章时继续使用原有分页配置和日期排序。

运行 `npm test` 检查空首页与添加文章后的分页行为；运行 `npm run build` 生成 `public/index.html`。发布时必须包含该文件，否则博客根地址会返回 404。
