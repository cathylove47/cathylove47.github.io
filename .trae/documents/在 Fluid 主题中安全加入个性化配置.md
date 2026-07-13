## 原则
- 不改动 `themes/fluid/_config.yml`；所有个性化只写在站点根的 `_config.fluid.yml`（优先级更高，升级主题不丢配置）。
- 复杂样式/脚本用 `source/css/custom.css` 与 `source/js/custom.js`，通过 `_config.fluid.yml` 的 `custom_css`、`custom_js`挂载。
- 文案与菜单词条用 `source/_data/languages/zh-cn.yml` 覆盖，避免直接改主题语言包。

## 可个性化项
- 导航栏：`navbar.menu` 增加“友链”“关于”等，支持 `key | link | icon | name`。
- 页眉大图：`index.banner_img`、`post.banner_img` 等统一自定义；高度与蒙版 `banner_img_height`、`banner_mask_alpha` 可调。
- 页脚内容：`footer.content` 支持 HTML，加入你的版权、备案、社交链接；`footer.statistics` 可选 PV/UV。
- 颜色/字体：`color.*` 与 `font.*` 统一品牌色和字体；暗色模式 `dark_mode.default` 可设为 `auto`/`dark`。
- 功能开关：`fun_features.typing`、`anchorjs`、`progressbar`、`lazyload` 按需启用。
- 文章信息：`post.meta`（作者、日期、字数、阅读时长）、`prev_next`、`copyright`。
- 社交与关于页：`about.avatar`、`about.icons` 扩展社交平台；`links.items` 维护友链。

## 计划变更（一次到位）
1. 更新 `_config.fluid.yml`：
   - `navbar.menu`：新增“友链”“关于”。
   - `footer.content`：加入你的版权/社交链接；如需备案开关 `footer.beian`。
   - `color.*`：设定主色与链接悬浮色；`dark_mode.default: auto`。
   - `fun_features.typing.scope: [home]` 并设定多行 `index.slogan.text` 列表，实现随机副标题。
   - `banner_img`：统一用主题默认 `/img/default.png` 或你提供的图；规范高度与蒙版。
   - `custom_css`、`custom_js`：指向 `/css/custom.css`、`/js/custom.js`。
2. 创建 `source/css/custom.css` 与 `source/js/custom.js`：
   - CSS：细节美化（按钮圆角、导航 hover、卡片阴影）。
   - JS：可选小交互（返回顶部加速度、图片懒加载优化等）。
3. 文案本地化覆盖：
   - 新建 `source/_data/languages/zh-cn.yml`，调整菜单 key 的显示名与一些提示文案。
4. 验证与调整：
   - `hexo clean && hexo g && hexo s -p 4000`，检查首页、文章页、标签/分类/归档页以及 404 页。
   - 若需要 CDN，保持 `static_prefix` 默认版本不变，避免混合内容。
5. 部署：
   - 使用现有 `npm run onekey` 一键部署到 GitHub Pages。

## 交付内容
- 更新后的 `_config.fluid.yml`（导航、页脚、颜色、功能开关、自定义资源挂载）。
- 新增 `source/css/custom.css`、`source/js/custom.js`。
- 新增 `source/_data/languages/zh-cn.yml`（可选）。
- 本地运行验证通过后再部署。