// 只做一件事：把视频文件选进 TikTok 网页上传表单，然后退出。
// 不填文案、不点发布、不做别的。文案和发布由 Muse 在用户 Chrome 里接手。
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CDP_URL = 'http://127.0.0.1:9222';
const VIDEO = path.join(process.env.USERPROFILE || '', 'Downloads', '01_CatPaw_TK.mp4');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(VIDEO)) {
    console.error('找不到视频文件：' + VIDEO + '。请先把 01_CatPaw_TK.mp4 放进下载文件夹。');
    process.exit(2);
  }
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_URL, { timeout: 15000 });
  } catch (e) {
    console.error('连不上 Chrome 调试端口 9222。请先完全关掉 Chrome，再用 --remote-debugging-port=9222 重新打开，然后再跑。');
    process.exit(3);
  }
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  page.setDefaultTimeout(60000);
  try {
    await page.goto('https://www.tiktok.com/upload', { waitUntil: 'domcontentloaded' });
    await sleep(3000);
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 30000 });
    await fileInput.setInputFiles(VIDEO);
    console.log('已选文件，等视频开始处理…');
    await page.locator('div[contenteditable="true"]').first().waitFor({ state: 'visible', timeout: 120000 });
    console.log('FILE_SET_OK：文件已选好，视频处理中。不要点发布，等 Muse 接手。');
    process.exit(0);
  } catch (e) {
    console.error('出错：' + (e && e.message ? e.message : e));
    try { await page.screenshot({ path: path.join(__dirname, 'set-file-error-' + Date.now() + '.png') }); } catch (_) {}
    process.exit(1);
  }
})();
