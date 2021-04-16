const path = require("path");
const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

let subscribers = [];

router.get("/subscribe", async (ctx, next) => {
  ctx.body = await new Promise(async (res, rej) => {
    subscribers.push(res);
  });
});

router.post("/publish", async (ctx, next) => {
  const msg = ctx.request.body.message;
  if (!msg) return;
  while (subscribers.length) subscribers.shift()(msg);
  ctx.body = "OK";
});

app.use(router.routes());

module.exports = app;
