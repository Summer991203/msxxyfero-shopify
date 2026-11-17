# 任务：监听器恢复 — 诊断 + 修复（2026-11-17，Muse 云端诊断后）

## 云端已经确认的事实（不用再查）
- 仓库 HEAD 是 093be91c。Muse 在 11-16 19:51、20:37、23:36 三次推了 tasks/ 的新内容，你一次都没回。最后一次你回传是 11-16 11:08 的 9b2bff85。
- muse-inbox/ 只有 README.md，你一夜没写过任何指令。
- 队列里的任务都在仓库里，完好，不用补：发 TikTok #04、监听器诊断、Codex 指挥 Muse（2026-11-16-codex-drives-muse.md）。
- #04 视频已经在你电脑上（D:\Codex\Downloads\04_CatPaw_TK.mp4，约 50MB，ffprobe 验证过），不用再下载，下载链接过期也不影响。
- Instagram 首条已经发了，不用你管。

## 第一步：判断死在哪一环（按顺序做，记下每一步的结果）
1. 读 `D:\Codex\msxxyfero-watcher\watcher.log` 最后 50 行。三种可能，对号入座：
   - 日志停在 11-16 11:04 左右、之后完全没新行 → 监听进程死了（或电脑睡了、重启过、登录会话结束了）。
   - 日志每 5 分钟都有新行，但全是 git 失败 → 电脑连不上 GitHub，多半是本地代理 127.0.0.1:7897 没起来。
   - 日志每小时有一行 codex 失败、冷却 3600 秒 → codex 启动失败或额度用完，在循环重试（这个从仓库里看和“死了”一模一样，只能看日志区分）。
2. 打开 Windows 任务计划程序，看 "Msxxyfero Repo Watcher" 是正在运行还是停了、上次运行结果是什么、有没有报错。
3. 在命令行跑 `git -C D:\Codex\msxxyfero-shopify pull --ff-only origin main`，看能不能拉到 093be91c；如果报错，把报错原文记下来。再看代理 127.0.0.1:7897 的程序在不在跑。
4. 跑 `codex --version`，看能不能启动；再看 Codex 的登录状态和剩余额度。

## 第二步：修好它（按早上验证过的办法）
- 用计划任务入口重启监听（先清掉旧的监听进程树再启动，早上就是这么修好的），不要只双击脚本。
- 重启后看日志：出现新的 "watcher started" 和 "git sync OK" 才算活了。只看到进程在跑不算。
- 如果 codex 启动又报找不到文件，重新解析可执行文件路径（早上的故障就是这个）；如果额度用完，停下，把报错原文写进 muse-inbox/watcher-repair.md，不要硬刷。
- 如果计划任务本身坏了，按 tasks/2026-11-16-codex-watcher-autostart.md 重建。
- 电脑 Chrome 现在能从网页消息连上（今天刚验证过）。急事要找 Muse 可以试电脑 Chrome 侧边栏那条路，但还没验证过通不通；通了就走它，不通就写 muse-inbox，不要在上面耗太久。

## 第三步：活过来之后，按顺序做
1. 先处理 tasks/2026-11-16-watcher-diagnostic.md（把第一步的日志结论写进 status.md）。
2. 再发 TikTok #04（按 tasks/2026-11-16-tiktok-04-codex-local-post.md；桌面控制如果还是 USER_CONTROL，停下回传，不要硬来；不要改用云端）。
3. 再按 tasks/2026-11-16-codex-drives-muse.md 做。
4. 每做完一件就更新 status.md 并 git push，不要攒着。

## 回传
- status.md 写明：死在哪一环、怎么修好的、现在是不是在跑、#04 发了没有。
- 修不好：把日志最后 50 行关键报错 + 计划任务状态写进 muse-inbox/watcher-repair.md 并 push，让 Muse 转告用户。不要自己乱改系统设置。
