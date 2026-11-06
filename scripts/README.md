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

## 本机 Windows 安装（2026-11-06）

- 仓库：`D:\Codex\msxxyfero-shopify`。
- 计划任务：`Msxxyfero Repo Watcher`，开机和 Administrator 登录时触发；S4U、最低权限运行，不保存登录密码，不允许任务并发，运行时长不限。
- 安装：管理员 PowerShell 执行 `scripts/install-watcher.ps1`；启动入口是 `scripts/start-watcher.ps1`，使用本机 D 盘 Python，并自动查找已安装的 Codex 可执行文件。
- 实际日志/状态文件在 `D:\Codex\msxxyfero-watcher\watcher.log` 和 `state.json`；用户目录下原来的两个文件名是指向 D 盘文件的符号链接，因此 `~/.msxxyfero-watcher.log` 仍可使用。
- 已修正：每轮真正执行 `git pull --ff-only`；git 失败时不启动 Codex；Codex 非零退出或超时后冷却 1 小时；输出按 UTF-8 解码；显式给予 D 盘工作目录和联网权限，以执行已授权的仓库任务。
- 模拟验证：首次基线、无改动、仅 status 改动、新任务、Codex 失败、Codex 超时、冷却期、git 失败，共 8 种分支通过。空轮询不调用模型。
- 首次基线之前的 brief 不会自动执行；本次只手动完成用户指定的 11 月 7 日文章，11 月 8、9 日仍待处理。
- 这只验证了监听器和分支逻辑，未用一篇额外真实文章验证后台 `codex exec` 的完整生图、连接器与发布链路；后续是否能完成任务仍取决于该非交互会话的工具、认证和额度。写入阻塞必须如实回传 `status.md`。
- 如果本次维护修改了 brief，提交后需把本机 `state.json` 的 `last_sha` 同步到该次已完成的提交，再启动计划任务，避免把维护提交误当新任务。
- Windows 停止计划任务可能遗留 Python 子进程；`start-watcher.ps1` 会先结束旧监听进程树，避免重启后并发。正常空轮询日志包含 `git sync OK`，可据此检查真实后台拉取结果。
- 本机 GitHub 直连不稳定；已在本仓库 `.git/config` 设置 `http.https://github.com/.proxy=http://127.0.0.1:7897`，复用 Windows 当前已有的本地代理（不提交配置、不改变系统代理）。该代理尚未启动时，脚本会记录网络失败并在下一轮重试。
