// Msxxyfero 本地 TikTok 发布脚本 v2（给 Codex 在用户电脑上跑）
// 用你自己的 Chrome（家里固定 IP、已经登录的 TikTok），不走云端、不耗 AI 额度。
// 用法：node scripts/tiktok-post.js <视频文件路径> [文案文件路径]
// 原理：通过 Chrome 调试端口（9222）连上你开着的 Chrome，打开 TikTok 上传页、
// 选本地视频文件、填文案、等上传完成 + 检查通过、点发布。
// 铁律（2026-11-16 用户）：点发布之前，必须等上传 100% 和下面的音乐版权检查、
// 内容快速检查都变绿（显示“未发现问题”）再点；没等完就点，视频会被吞
// （Studio 显示已发布，主页不显示）。脚本里加了这个等待，没等完不会点发布。
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CDP_URL = 'http://127.0.0.1:9222';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

async function main() {
  const videoPath = process.argv[2];
  const captionFile = process.argv[3] || path.join(__dirname, 'caption.txt');
  if (!videoPath || !fs.existsSync(videoPath)) {
    console.error('用法：node scripts/tiktok-post.js <视频文件路径> [文案文件路径]');
    console.error('视频文件不存在：' + videoPath);
    process.exit(2);
  }
  if (!fs.existsSync(captionFile)) {
    console.error('文案文件不存在：' + captionFile);
    process.exit(2);
  }
  const caption = fs.readFileSync(captionFile, 'utf8').trim();
  log('视频：' + videoPath);
  log('文案共 ' + caption.length + ' 字');

  // 1. 连上已开着的 Chrome（调试端口 9222）
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_URL, { timeout: 15000 });
  } catch (e) {
    console.error('连不上 Chrome 调试端口 9222。');
    console.error('请先完全关掉 Chrome，再用 --remote-debugging-port=9222 重新打开 Chrome，然后再跑一次。');
    process.exit(3);
  }
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  page.setDefaultTimeout(60000);

  const shot = async (name) => {
    const f = path.join(__dirname, `error-${Date.now()}-${name}.png`);
    try { await page.screenshot({ path: f }); log('已保存截图：' + f); } catch (_) {}
  };

  try {
    // 2. 确认 TikTok 登录态
    log('正在打开 TikTok，确认登录账号…');
    await page.goto('https://www.tiktok.com/@msxxyfero.shop', { waitUntil: 'domcontentloaded' });
    await sleep(4000);
    const bodyText = (await page.locator('body').innerText().catch(() => '')) || '';
    if (/Log in|登录/.test(bodyText) && !/msxxyfero\.shop/i.test(bodyText)) {
      console.error('TikTok 在这个 Chrome 里没有登录。请先在 Chrome 里手动登录 @msxxyfero.shop，再跑一次。');
      await shot('not-logged-in');
      process.exit(4);
    }
    log('登录态正常。');

    // 3. 打开上传页
    log('正在打开上传页…');
    await page.goto('https://www.tiktok.com/upload', { waitUntil: 'domcontentloaded' });
    await sleep(3000);

    // 4. 选视频文件
    log('正在选择视频文件…');
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 30000 });
    await fileInput.setInputFiles(videoPath);
    log('已选文件，等 TikTok 处理视频…');
    await sleep(5000);

    // 5. 填文案（contenteditable 的 caption 框；先 fill，不行再点进去打字）
    log('正在填文案…');
    const captionBox = page.locator('div[contenteditable="true"]').first();
    await captionBox.waitFor({ state: 'visible', timeout: 120000 });
    await captionBox.click();
    await sleep(500);
    try {
      await captionBox.fill(caption);
    } catch (_) {
      await page.keyboard.type(caption, { delay: 5 });
    }
    await page.keyboard.press('Escape');
    await sleep(1000);
    log('文案已填。');

    // 6. 铁律：等上传 100% + 两项检查都变绿再点发布（2026-11-16 用户规则）
    // 没等完就点发布，视频会被吞。最多等 4 分钟；等不到就不点发布，直接报错退出。
    log('正在等上传完成和检查通过（上传 100% + 音乐版权检查、内容快速检查变绿）…');
    const waitDeadline = Date.now() + 240000;
    let ready = false;
    while (Date.now() < waitDeadline) {
      const txt = (await page.locator('body').innerText().catch(() => '')) || '';
      const stillWorking = /上传中|正在上传|Uploading|检查中|正在检查|处理中/i.test(txt);
      const okCount = (txt.match(/未发现问题/g) || []).length;
      if (!stillWorking && okCount >= 2) { ready = true; log('上传完成，两项检查都通过（未发现问题 x2）。'); break; }
      await sleep(5000);
    }
    if (!ready) {
      console.error('4 分钟内没等到上传完成 + 两项检查通过，不点发布。');
      console.error('请打开 TikTok 上传页看一下状态；如果上传卡住了，把截图发给新一改脚本。');
      await shot('not-ready');
      process.exit(5);
    }

    // 7. 点发布（Post / 发布）
    log('正在点发布…');
    const postBtn = page.getByRole('button', { name: /^(Post|发布)$/ });
    await postBtn.waitFor({ state: 'visible', timeout: 30000 });
    await postBtn.click();
    log('已点发布，等 TikTok 处理…');

    // 8. 等成功：地址变成视频页，或出现成功提示
    const deadline = Date.now() + 180000;
    let ok = false;
    while (Date.now() < deadline) {
      const url = page.url();
      if (/tiktok\.com\/@msxxyfero\.shop\/video\//.test(url)) { ok = true; log('成功！视频链接：' + url); break; }
      const txt = (await page.locator('body').innerText().catch(() => '')) || '';
      if (/视频已发布|Your video has been published/i.test(txt)) { ok = true; log('已发布，当前页面：' + url); break; }
      if (/Upload failed|上传失败|Something went wrong/i.test(txt)) { console.error('TikTok 提示上传失败。'); break; }
      await sleep(5000);
    }
    if (!ok) {
      console.error('点了发布，但 3 分钟内没等到明确的成功提示。');
      console.error('请打开 https://www.tiktok.com/@msxxyfero.shop 看一下视频在不在；');
      console.error('如果在，就是发成功了；如果不在，把截图发给新一改脚本。');
      await shot('no-confirm');
      process.exit(5);
    }
    log('上传成功。');
    process.exit(0);
  } catch (e) {
    console.error('出错了：' + (e && e.message ? e.message : e));
    await shot('failed');
    console.error('把上面这张截图和报错发给新一，我来改脚本。');
    process.exit(1);
  }
}

main();
