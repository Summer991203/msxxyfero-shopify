# 任务：TikTok #01 只做“选文件”这一步（2026-11-14）

## 只做这一件事
把拖鞋视频 #01 的文件选进 TikTok 网页上传表单。做完就停，不要做别的。

## 绝对不要做的事
- 不要填文案、不要点发布、不要做养号浏览、不要点赞/关注/评论
- 不要改任何账号设置、不要碰别的视频、不要重写脚本
- 文案和发布由 Muse 在用户 Chrome 里接手做，他操作网页比你快

## 输入
- 视频文件：用户电脑“下载”文件夹里的 `01_CatPaw_TK.mp4`
  （如果不在，先问用户要文件；不要自己找别的视频代替）
- 脚本：`scripts/set-tiktok-file.js`（仓库里已经有了，直接用，不要重写）
- TikTok 账号：@msxxyfero.shop（已在用户 Chrome 里登录）

## 步骤
1. 先问用户：TikTok #01 发出去了没有？（云端任务 2026-11-14 10:49 已经发了，大概率是发了。）
   - 用户说发了：不用传文件，但还是要把环境搭好——装 playwright-core、确认 Node.js 可用、确认脚本能连上用户 Chrome 的调试端口 9222（只测连接，不要打开上传页、不要选任何文件），然后到“回传”写“#01 已发布不用传，环境已搭好”，任务结束。
   - 用户说没发：继续下面步骤。
2. 确认 Node.js 可用；进 `scripts/` 装一次 playwright-core（`npm install playwright-core`，只装这一次）。不要把 node_modules 推回仓库。
3. 连用户 Chrome 的调试端口 9222。如果连不上：让用户先完全关掉 Chrome，你再用 `--remote-debugging-port=9222` 重新打开 Chrome，然后再跑脚本。不要改用户 Chrome 的其他设置。
4. 跑 `node scripts/set-tiktok-file.js`：连上用户 Chrome，打开 https://www.tiktok.com/upload ，把视频文件选进上传框，等到文案框出现（说明视频已开始处理），就停下、退出。
5. 脚本报错就记下来，最多重试 2 次，不要一直刷。

## 完成标准
- 上传表单里已选好 01_CatPaw_TK.mp4，视频正在处理（文案框已出现），且你没有点发布。
- 如果 #01 已发布：环境已搭好（playwright 已装、能连上 Chrome 调试端口）即算完成。

## 回传
- 更新 `status.md`：写明文件已选好、时间；失败就写明报错原文。
- 在本任务文件末尾追加一行结果（已选好 / 已发布不用做 / 失败+报错）。
- `git push` 推回仓库。

- 2026-11-14 10:59:46（Asia/Shanghai）结果：失败/待用户补充。用户确认未发布；Node.js 可用且 playwright-core 1.65.1 已安装。两个下载路径均缺少指定文件，已询问用户位置；连接报错原文：browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9222。待用户确认退出 Chrome；未选文件、未发布，原脚本未改动。

- 2026-11-14 11:02:04（Asia/Shanghai）最新结果：用户更正 #01 已发布，不用传文件、不再查找视频。Node.js 和 playwright-core 已就绪，Chrome 调试连接尚未完成。用户要求 Facebook 检查期间保持 Chrome 运行，等其明确通知后再重启开调试端口；此时只测连接，不打开上传页、不选文件。
