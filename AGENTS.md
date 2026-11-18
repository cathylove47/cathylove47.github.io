# pathology-atlas-src（发布产物仓库）

本仓库是 `cathylove47/cathylove47.github.io` 的 `main` 分支克隆，内容全是**已构建的静态文件**，不是源码。线上域名 `https://cathy47.party/`（`CNAME`），Pages 根即本仓库根。

## 目录与源码来源

| 目录 | 来源（改这里，不要改本仓库） | 构建 |
|---|---|---|
| `pathology-atlas/` | `~/code/myblog/paper-reading-atlas`（`lib/papers.ts`、`public/papers/*`、`public/data/*`） | `npm run build:static` → `dist/static` |
| `courses/` | `~/code/course-notes` | `npm run build:courses` → `dist/courses` |
| 根目录其余（`index.html`、`about`、`categories`、`tags`、`css`、`js`、`img`、`uploads`、`local-search.xml`、`404.html`） | Hexo 博客 `~/code/myblog`（`hexo generate`） | — |

- 禁止手改 `pathology-atlas/assets/*`、`courses/**` 里的 bundle 与生成文件，下次覆盖会丢。
- 两个子站互相独立：更新一个时不得改动另一个目录。

## 更新 atlas 的步骤

默认做法：在源码仓库提交并推送后运行 `npm run publish:site`（`scripts/publish-site.mjs`，先加 `--dry-run` 看改动）。它自动完成下面 1–6 步，落后就 `--ff-only` 快进，分叉或有未提交改动就停，从不 force push。以下是脚本失败时的手动步骤。

1. `git -C ~/code/myblog/paper-reading-atlas pull --ff-only`，再 `npm run build:static`（`dist/static` 是产物，必须是新构建）。
2. 本仓库先 `git pull --ff-only`；确认不落后于 `origin/main`。
3. 先删后拷：`rm -rf pathology-atlas && cp -R <源码>/dist/static pathology-atlas`。
4. 提交信息：`Sync atlas: <要点> (source <源码短SHA>)`，与历史一致；推送 `main`。
5. 绑定链（用户要求，缺一处下次重建会回退线上）：同步 `~/code/myblog/source/pathology-atlas/` 与 `public/pathology-atlas/`（`rsync -a --delete dist/static/`），`~/code/myblog/.deploy_git` 拉到最新，bump 博客仓库里的子模块指针并 push `source` 分支。
6. 验证：`curl https://cathy47.party/pathology-atlas/` 的 bundle 文件名/哈希与本地一致，抽查几篇 `papers/**/*.md` 返回 200。

课程站同理，源码与构建换成 `course-notes`，只更新 `courses/`。

## 坑

- 本机存在**两个**该 remote 的克隆：本仓库与 `~/code/myblog/.deploy_git`。从落后的那个 push 会回退全站；push 前先 `git fetch` 并确认是 `origin/main` 的后代。
- 不要运行 `~/code/myblog/bin/deploy.sh`：它整站重发并强推 `.deploy_git` 的 `HEAD:main`，除非先确认 `.deploy_git` 是 `origin/main` 的祖先。
- `bin/sync-learning-sites.sh` 会用 `paper-reading-atlas/dist/static` 和 `../course-notes/dist/courses` 覆盖 `public/`；产物缺失时回退到 `origin/main`，因此源码构建过期会静默带回旧版。
- 不要 force push；不要删除 `CNAME`（域名会掉）。
- 验证必须用 `cathy47.part​y`，旧域名 `www.cathy47.online` 已全路径 404。本机 DNS 被代理接管，解析异常时用 `curl --resolve cathy47.party:443:185.199.108.153`。
- 论文入库规则（精读模板、`lib/papers.ts` 注册、arXiv 候选）见 `paper-reading-atlas/docs/arxiv-workflow.md`，不在本仓库处理。
