## 修改项
- 将 `_config.fluid.yml` 中所有自定义图片改为 Fluid 官方内置资源：
  - `avatar: /img/avatar.png`
  - `index.banner_img: /img/default.png`
  - `tag.banner_img: /img/default.png`
  - `category.banner_img: /img/default.png`
  - `archives.banner_img: /img/default.png`
  - `post.banner_img: /img/default.png`
- 图标文件改回主题默认（可选）：
  - 删除或改为 `favicon: /img/favicon.png`，避免引用 NexT 的 `images/favicon-32x32-next.png`

## 变更原因
- 使用主题内置资源更兼容且风格统一，避免本地 `uploads/` 的个人素材造成不一致。
- 所有路径均为站点根路径，Fluid 在构建时会生成对应资源（例如 `img/avatar.png`、`img/default.png`）。

## 验证步骤
- 执行：`hexo clean && hexo g && hexo s -p 4000`
- 访问：
  - `http://localhost:4000/` 检查首页 banner 与头像
  - `http://localhost:4000/img/avatar.png` 与 `http://localhost:4000/img/default.png` 直接访问确认
- 若你使用 GitHub Pages：`npm run onekey` 发布并在线验证

## 我将执行的操作
1. 更新 `_config.fluid.yml` 中的 `avatar` 与各页面 `banner_img` 为官方默认。
2. 将 `favicon` 改为主题默认或移除该配置。
3. 本地清理、生成并启动，确认图片加载正确；如需我同时部署，直接执行部署脚本。