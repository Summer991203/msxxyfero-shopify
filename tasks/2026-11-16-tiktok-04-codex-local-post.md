# 任务：TikTok 拖鞋 #04 本地发布（2026-11-16，Codex 在用户电脑上跑）

## 背景（为什么走本地）
- TikTok 账号 @msxxyfero.shop，云端浏览器发视频 4 次全部静默失败：Studio 显示“已发布”，公开主页就是不显示（#02 三次 + #03 一次）。云端一打开 TikTok 就弹滑块验证码，Muse 过不了。
- 2026-11-16 用户本地自己发 #04 的前一条 #02，一次就成功上线了（https://www.tiktok.com/@msxxyfero.shop/video/7708593441164365070）。结论：发视频走用户本地 Chrome（家里固定 IP、已登录），不走云端。
- 用户决定：以后 TikTok 发视频都由 Codex 在本地发。

## 只做这一件事
把拖鞋视频 #04「Paw Inspection」发到 @msxxyfero.shop，公开，文案逐字用 `scripts/caption-04.txt`。发完核对、回传，就停。

## 铁律（2026-11-16 用户，之前 4 次失败的教训）
- 点发布之前，必须等上传 100% 和下面的音乐版权检查、内容快速检查都变绿（显示“未发现问题”）再点；没等完就点，视频会被吞。脚本 `scripts/tiktok-post.js` 里已经加了这个等待（最多等 4 分钟，等不到就不点发布、直接报错退出）——不要绕过它，不要手动提前点发布。

## 绝对不要做的事
- 不要走云端、不要用 Muse 的云端浏览器发；不要发 #03（已暂停的死内容，不要碰）；不要改账号设置、不要碰别的视频、不要改文案（逐字用 caption 文件里的）；不要加链接、价格或数字。
- 不要重写脚本：`scripts/tiktok-post.js` 仓库里已经有了，直接用；有 bug 只做最小修复并写清楚改了哪一行、为什么。

## 输入
- 视频文件：你自己从下载链接取（见步骤 2），存到 `D:\Codex\Downloads\04_CatPaw_TK.mp4`。不要让用户手动下载；如果链接失效，停下回传，等 Muse 重新发链接。不要自己找别的视频代替，不要发 #03 或别的编号。
- 脚本：`scripts/tiktok-post.js`（仓库里已经有了，直接用，不要重写）
- 文案：`scripts/caption-04.txt`（逐字用，不要改任何词）
- TikTok 账号：@msxxyfero.shop（已在用户 Chrome 里登录）

## 步骤
1. `git pull`，确认拿到最新任务和脚本。
2. 先自己下载视频文件，不要让用户手动下载：用 PowerShell `Invoke-WebRequest -Uri 'https://muse.ai/files/1393442267190366/2212322609717359/9sfutropxuuqf6ur0uzede8i/04_CatPaw_TK.mp4' -OutFile 'D:\Codex\Downloads\04_CatPaw_TK.mp4'`（或 `curl -L -o 'D:\Codex\Downloads\04_CatPaw_TK.mp4' 'https://muse.ai/files/1393442267190366/2212322609717359/9sfutropxuuqf6ur0uzede8i/04_CatPaw_TK.mp4'`），存到 `D:\Codex\Downloads\04_CatPaw_TK.mp4`。链接有效期到 2026-11-18 03:02 UTC，尽快下载；下载完确认文件存在且大小约 50MB 再往下走。如果链接过期或下载失败，停下并回传说明，等 Muse 重新发链接，不要让用户手动下载。
3. 确认 Node.js 可用；进 `scripts/` 装一次 playwright-core（`npm install playwright-core`，只装这一次）。不要把 node_modules 推回仓库。
4. 连用户 Chrome 的调试端口 9222。如果连不上：让用户先完全关掉 Chrome，你再用 `--remote-debugging-port=9222` 重新打开 Chrome，然后再跑脚本。不要改用户 Chrome 的其他设置。
5. 跑 `node scripts/tiktok-post.js "D:\Codex\Downloads\04_CatPaw_TK.mp4" scripts/caption-04.txt`。脚本会自己：确认登录、打开上传页、选文件、填文案、等上传 100% + 两项检查变绿、点发布、等成功提示。脚本报错就记下来，最多重试 2 次，不要一直刷。
6. 脚本显示成功后，亲自核对：打开 https://www.tiktok.com/@msxxyfero.shop ，主页视频数应该是 3（原来 2 条：#01 + #02）；打开最新那条视频，确认文案逐字无误、标签齐全、视频能播放。记下公开视频链接。

## 完成标准
- 主页视频数为 3，最新一条就是 #04「Paw Inspection」，文案逐字无误、标签齐全、能播放。
- 如果脚本 2 次都失败：不要继续刷，把报错原文 + 截图文件名写进回传，等用户决定。

## 回传
- 更新 `status.md`：写明已发、公开链接、核对时间；失败就写明报错原文。
- 在本任务文件末尾追加一行结果（已发 + 公开链接 / 失败 + 报错）。
- `git push` 推回仓库。
