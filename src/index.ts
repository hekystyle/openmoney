import Koa from "koa";

const PORT = 3000;

const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World!" + (new Date().toISOString());
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
