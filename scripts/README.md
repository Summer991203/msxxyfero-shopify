# scripts/

## watch-repo.py — 让 Codex 自动发现新任务的监听脚本

跑在**用户电脑上**，不是 Muse 云端。Muse 在云端够不到用户电脑，所以触发必须分两段：

- Muse：把任务写进 GitHub 仓库（`tasks/` / `briefs/`）。
- 这个脚本：每 5 分钟 `git pull` 一次，发现 `tasks/` 或 `briefs/` 有新内容，就调一次 `codex exec` 让 Codex 去做，做完 Codex 自己 `git push`。

延迟 = 轮询间隔，默认 5 分钟，不是实时推送。额度用完时 `codex exec` 会失败，脚本会冷却 1 小时再试，不会一直刷额度。

## 安装（让用户电脑上的 Codex 来装）

1. `git clone https://github.com/Summer991203/msxxyfero-shopify.git`
2. 在仓库目录里跑：`python scripts/watch-repo.py`
3. 想开机自动跑，让 Codex 按电脑系统设一个定时任务：Windows 用任务计划程序，Mac 用 launchd，Linux 用 cron，都是“开机启动这个脚本”或“每 5 分钟跑一次”。

状态文件在 `~/.msxxyfero-watcher-state.json`，日志在 `~/.msxxyfero-watcher.log`，都不进仓库。
