## 问题与原因
- 报错 `listen EADDRINUSE: address already in use :::4000` 表示本机 `4000` 端口已被其他进程占用。
- Hexo 端口解析优先级：命令行参数 > `_config.yml` 的 `server.port` > 环境变量 `port`（注意是小写）。代码位置：`node_modules/hexo-server/lib/server.js:14`。
- 端口占用时会抛出并提示更换端口：`node_modules/hexo-server/lib/server.js:37-43`。
- 你执行的命令 `hexo s port` 用法不正确，正确的是 `hexo s -p <端口>` 或 `hexo s --port <端口>`。

## 解决方案
### 方案A：释放 4000 端口（推荐）
1. 查找占用 4000 的进程：
   - `lsof -nP -iTCP:4000 -sTCP:LISTEN`
2. 结束对应进程（将 `<PID>` 替换为上一步的进程号）：
   - `kill <PID>`（必要时用 `kill -9 <PID>`）
3. 重新启动 Hexo：
   - `hexo s`（默认 4000）

### 方案B：改用其他端口启动 Hexo（无需改文件）
- 示例：`hexo s -p 4001` 或 `hexo server --port 4001`
- 如需指定 IP：`hexo s --ip 0.0.0.0`（或局域网 IP）。IP/端口参数会覆盖配置文件。

### 方案C：在 `_config.yml` 固化端口（可选）
- 添加：
  ```yaml
  server:
    ip: 0.0.0.0
    port: 4001
  ```
- 生效逻辑同上：命令行参数优先于配置；环境变量次之。

### 方案D：用环境变量（不常用）
- 因为 Hexo 读取的是小写 `port`：
  - macOS/zsh：`export port=4001 && hexo s`
  - 注意 `PORT=4001` 不会被 Hexo 读取。

## 验证步骤
- 启动成功后日志会打印访问地址，例如：`Hexo is running at http://localhost:4001/`（来源：`node_modules/hexo-server/lib/server.js:27-29`）。
- 浏览器打开对应地址并确认页面正常加载。

## 我将执行的操作（待你确认后）
- 用命令行查找并释放占用 `4000` 的进程；若你更偏好改端口，则直接用 `-p 4001` 启动。
- 如需长期固定端口，按你的意愿更新 `_config.yml` 的 `server` 段并再次验证。
