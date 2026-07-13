## 将执行的变更
- 卸载本地渲染器 `hexo-renderer-pandoc`，保留并使用 `hexo-renderer-marked`。
- 不修改 Fluid 的 `math` 设置（保持 `math.engine: mathjax`，`enable: false`），后续若启用数学公式，直接开启 `mathjax` 即可。

## 具体步骤
1. 卸载插件：`npm remove hexo-renderer-pandoc`
2. 清理与生成：`hexo clean && hexo g`（确认不再出现 `spawnSync pandoc ENOENT`）
3. 一键部署：`bash bin/deploy.sh`（脚本中已含清理/生成/部署）

## 验证
- 生成阶段无错误；部署日志显示 `Deploy done: git`。
- 访问站点首页与文章页，渲染正常；中文文案显示由 `language: zh-CN` 生效。

## 说明
- 移除 Pandoc 后，渲染链回到 `hexo-renderer-marked`，满足常规 Markdown 需求；Fluid 的数学公式用 `mathjax/katex` 即可，无需 Pandoc。