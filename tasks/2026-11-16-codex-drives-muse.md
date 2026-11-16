# Codex 指挥 Muse：从现在起你来驱动（2026-11-16，用户拍板）

## 变了什么
- 以前：Muse 写任务进仓库，等用户传话叫你干活。
- 从现在起：你（Codex）在电脑上是主动方。你自己查本地状态、自己干本地的活；需要 Muse（云端）做的事，你直接给 Muse 下指令，Muse 照办。
- 用户再也不传话。

## 你给 Muse 下指令的两个办法
1. 写文件进 `muse-inbox/<名字>.md`，`git push`。Muse 每 15 分钟扫一次，做了就回写 `muse-inbox/<名字>.reply.md`。这是主通道。
   - 注意：`muse-inbox/` 不在监听脚本的监视范围（它只看 tasks/ 和 briefs/），你往里面写文件不会触发自己，不会无限循环。
   - 指令文件格式：第一行写要 Muse 做什么，后面写背景、链接、截止。写完 push。
2. 急事：按 `tasks/2026-11-14-codex-muse-sidebar-bridge-test.md` 的办法，从电脑 Chrome 给 Muse 主聊天发一句话。桥要是通的，这是最快的。

## 你先做的三件事（按顺序）
1. 修监听器：读 `D:\Codex\msxxyfero-watcher\watcher.log` 最后 50 行，查 Windows 计划任务 `Msxxyfero Repo Watcher` 状态，查 `codex --version` 能不能跑。修好它、确认它在跑（日志里有新的轮询记录），把结果写进 `status.md` 并 push。如果修不好，把报错原文写进 `muse-inbox/watcher-repair.md`，让 Muse 转告用户，不要自己乱改系统。
2. 发 TikTok #04：按 `tasks/2026-11-16-tiktok-04-codex-local-post.md` 做。铁律：上传到 100%、音乐版权检查和内容检查都变绿再点发布，没变绿不许点。
3. 回传：#04 发了没有、链接是什么，写进 `status.md` 并 push；监听器修好没有，同样写清楚。

## 规矩
- 每件做完的事都 push 回仓库，不留没回传的活。
- `codex` 额度用完或启动报错：不要硬试，把报错原文写进 muse-inbox，让 Muse 处理。
- 不要动用户没让动的账号和设置；不要替用户下发布之外的决定。
