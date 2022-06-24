const puppeteer = require("puppeteer");
const { autoScroll, modalKiller, checkBodyScroll } = require("./utils");
const fs = require("fs");
const { resolve } = require("path");

const shotsDir = resolve(__dirname, "..", "shots");
if (!fs.existsSync(shotsDir)) {
  fs.mkdirSync(shotsDir);
}

// 对单个页面取快照
const screenshot = async (page, url, type) => {
  return new Promise((resolve) => {
    page
      .goto(url, {
        waitUntil: ["domcontentloaded"],
      })
      .then(async () => {
        await checkBodyScroll(page);
        await autoScroll(page);

        setTimeout(async () => {
          await modalKiller(page);
          await page.screenshot({
            fullPage: true,
            path: `./shots/${await page.title()}.${type}`,
          });
          await page.close();
          resolve();
        }, 1000);
      })
      .catch(async () => {
        console.log(`${url}打开失败了`);
        await page.close();
        resolve();
      });
  });
};

// 启动应用
const run = async (urls = [], type = "png") => {
  if (!Array.isArray(urls) || !urls.length) {
    return;
  }
  let browser = await puppeteer.launch({
    args: [
      "--window-size=1920,1080",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-zygote",
      "--no-sandbox",
    ],
    timeout: 0,
    pipe: true,
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
  });

  const shots = [];
  for await (const url of urls) {
    let page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36"
    );
    shots.push(screenshot(page, url, type));
  }

  await Promise.all(shots);

  await browser.close();
};

module.exports = {
  run,
};
