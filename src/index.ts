import Koa from "koa";
import Router from "koa-router";

const PORT = 3000;

const app = new Koa();

const router = new Router();
router.get('/', async ctx => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

app.use(router.middleware());

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
