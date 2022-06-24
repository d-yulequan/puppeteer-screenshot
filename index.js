const puppeteer = require("puppeteer");
const { autoScroll } = require("./utils");
const { modalKiller, checkBodyScroll } = require("./dom");

const tests = [
  "https://www.merckgroup.com.cn/cn-zh/research/science-space/envisioning-tomorrow/scarcity-of-resources/mof.html",
  "https://www.globenewswire.com/news-release/2022/04/13/2422077/0/en/Neoleukin-Therapeutics-Announces-Preclinical-Data-for-NL-201-at-American-Association-for-Cancer-Research-AACR-Annual-Meeting.html",
  "https://www.biospace.com/article/releases/starton-therapeutics-doses-first-subjects-in-phase-1-clinical-trial-of-star-lld-continuous-delivery-lenalidomide/?s=67",
  "https://www.prnewswire.com/news-releases/official-best-of-sabcs-r-news-cobertura-dos-destaques-do-sabcs-r-de-2020-825815885.html",
  "https://www.telethon.it/en/stories-and-news/news/from-telethon-foundation/orchard-therapeutics-receives-ec-approval-for-libmeldy/",
  "https://allied.health/pharmaceutical/#pharma-development",
  "https://www.dompe.com/en/media/press-releases/domp%C3%A9-investimenti-strategici-e-collaborazione-con-engitix-per-luso-di-exscalate-la-piattaforma-di-intelligenza-artificiale-per-la-drug-discovery",
];
(async () => {
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
    headless: false,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
  });
  let page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
  );
  await page.goto(tests[0], {
    timeout: 30000,
    waitUntil: ["networkidle0"],
  });

  await checkBodyScroll(page);
  await autoScroll(page);

  setTimeout(async () => {
    await modalKiller(page);
    await page.screenshot({
      fullPage: true,
      path: "./title.png",
    });
    await browser.close();
  }, 1000);
})();
