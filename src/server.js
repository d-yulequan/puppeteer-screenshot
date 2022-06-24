const Koa = require("koa");
const app = new Koa();

const { run } = require("./client");

app.use(async (ctx) => {
  const { request } = ctx;
  if (request?.url) {
    const { url = "", type = "png" } = request.query;
    await run(url.split(","), type);
    ctx.body = "搞完了";
  } else {
    ctx.body = "链接错了，傻蛋";
  }
});

app.listen(3011);
console.info(`server is running at 3011`);
