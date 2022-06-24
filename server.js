const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  if (ctx.request.url.indexOf('/') > -1) {
    // TODO
  } else {
    ctx.body = '链接错了，傻蛋'
  }
});

app.listen(3011);
console.info(`server is running at 3011`)
