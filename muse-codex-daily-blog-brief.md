# Muse + Codex 协作：每日独立站 Blog

## 分工（用户 2026-11-06 定）
- **Muse (SUMMER)：** 持续对话、规划、选题、核实事实、验 live 页、记进度。强在连贯性和校验。
- **Codex（用户电脑上）：** 代码、本地操作、内置生图、生成 + 发布 Blog。强在执行和生图。
- **两人不能实时对话。** 协作靠交接文件来回传：Muse 写 brief → Codex 执行并回传结果 → Muse 验 live → 记入下一天。

## 循环（每天 1 篇）
1. Muse 给选题、大纲、已核实事实、SEO 标题/描述、配图要求
2. Codex 按 brief 生成文章 + 生图 + 发布到 Shopify Blog，返回链接
3. Muse 打开 live 页逐项验：标题、价格、产品名、链接、图片、错别字
4. 有问题 Muse 写回修清单给 Codex 改；没问题记入日报，定次日选题

## 硬规则（Codex 也必须遵守，Muse 负责验）
- 产品名：Pop-Up Cat Ball，不是 carrier，不是 rolling playpen
- 价格：$29.99，was $39.99，free shipping，Black Friday 截止 Dec 1
- 保证：30-day guarantee — full refund, no need to send it back；supervised use only — stay with your cat
- 绝不写 5 折 / 7 折；绝不编评价。Pop-Up Cat Ball 是 0 reviews；Keychain 4.92/5（252），Sleeping Bag 4.67/5（39）
- 产品形态：fully closed black spherical mesh ball，cross straps + zipper，cat completely inside
- 作者：Summer Chan，Pupu 是三岁缅因猫；不写多年养猫经验

## 已有 7 篇（不要重复选题）
1. How to Introduce an Indoor Cat to Outdoor Play
2. Cat Playpen Buying Guide: 7 Checks Before You Choose
3. Rolling Cat Playpen vs. Catio: Which Fits Your Cat?
4. Outdoor Cat Enclosure Size: How to Check the Fit
5. Cat Cave vs Open Cat Bed: Follow Your Cat's Nap Habits
6. Cat Sleeping Bag Size Guide: M vs L for Small Cats
7. How to Fill a Cat Hair Keepsake Keychain

## 下一篇建议（Muse 拟，待 Codex 执行）
题目：Indoor Cat Outdoor Play Safety: 7 Supervised-Use Checks Before You Go Out
角度：安全清单，不是产品推销；文末自然提到 Pop-Up Cat Ball 一次，带产品链接。
大纲：
1. 先看猫的性格：害怕 / 好奇怎么判断
2. 选对时间地点：安静、阴凉、远离狗和车
3. 监督使用：人一直在旁边，不离场
4. 球里要通风、遮阳、有水吗
5. 出门前检查拉链和绑带
6. 多久一次、一次多久
7. 回家后的检查：爪子、毛、情绪
字数：800-1000 词，英文，口语化，Summer 第一人称。
配图（Codex 生图，3 张）：
1. 黑色网状圆球，猫完整在里面，草地背景
2. 主人蹲在球旁边看着猫，阳台场景
3. 球的拉链 / 交叉绑带特写
SEO：title 60 字内，meta description 150 字内，含 indoor cat outdoor play / supervised outdoor。

## Codex 回传格式（发布后贴回来）
- Live URL：
- 标题 / Slug：
- 配图文件（3 张）：
- 发布时有没有改动 brief 的地方：
- 自查：价格、产品名、保证、链接都对吗？

## 共享通道（2026-11-06 查过状态）
- GitHub：Muse 侧目前 not_connected，需一次 OAuth + 选仓库；Codex 侧是原生（git pull/push、diff、版本记录），最适合文字 brief + 文章 + 状态文件。
- Google Drive：Muse 侧已 connected，今天 8 条视频就是走 Drive 传的，已验证可用；Codex 侧不是原生，要靠本地同步文件夹或 API，文字来回容易互相覆盖、没有版本记录。
- 推荐：GitHub 为主（brief、文章、进度），Drive 为辅（生图原图、大文件）。图片最终是传到 Shopify 上，Muse 验的是 live 链接，不用把大图都塞进仓库。
- Drive 图片文件夹已建好 2026-11-06：Msxxyfero Blog Images - Codex，https://drive.google.com/drive/folders/1gG9siRiuZMwhVSfLKIhgsekctAkTK1gK — Codex 生图放这里，Muse 从这里取图验。
