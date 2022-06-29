const puppeteer = require("puppeteer");
const { autoScroll, modalKiller, checkBodyScroll } = require("./utils");
const rimraf = require("rimraf");
const fs = require("fs");
const { resolve } = require("path");

function createDir(dirname) {
  const dir = resolve(__dirname, "..", dirname);
  fs.existsSync(dir)
    ? rimraf(dir, () => {
        console.log("删除", dirname);
        fs.mkdirSync(dir);
      })
    : fs.mkdirSync(dir);
}
createDir("shots");
createDir("pdf");

// 对单个页面取快照
const screenshot = async (page, url) => {
  return new Promise((resolve, reject) => {
    page
      .goto(url, {
        waitUntil: ["networkidle0"],
      })
      .then(async () => {
        await checkBodyScroll(page);
        await autoScroll(page);

        setTimeout(async () => {
          await modalKiller(page);
          const filename = async (dirname, type) => `./${dirname}/${await page.title()}.${type}`;
          await page.screenshot({
            fullPage: true,
            path: await filename("shots", "png"),
          });
          await page.pdf({ path: await filename("pdf", "pdf"), format: "a4" });
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
const run = async (urls = []) => {
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
    shots.push(screenshot(page, url));
  }

  await Promise.all(shots);

  await browser.close();
};

module.exports = {
  run,
};
