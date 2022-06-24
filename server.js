const Koa = require("koa");
const app = new Koa();

app.use(async (ctx) => {
  const { request } = ctx;
  let url;

  try {
    url = new URL(request?.url);
    console.log(url);
  } catch (error) {
    ctx.body = "链接错了，傻蛋";
  }

  // TODO
});

app.listen(3011);
console.info(`server is running at 3011`);
