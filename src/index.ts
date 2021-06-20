import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import { del, get, getAll, post, put } from "./controllers/categories";
import { respond, RespondContext } from "./middleware/respond";

const PORT = 3000;

const app = new Koa();

app.use(respond());
app.use(bodyParser());

const router = new Router<{}, RespondContext>();
router.get('/', async ctx => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

const cats = new Router<{}, RespondContext>();
cats.prefix('/categories');
cats.get('/', getAll);
cats.get('/:id', get);
cats.post('/', post);
cats.put('/:id', put);
cats.delete('/:id', del);
router.use(cats.middleware());

app.use(router.middleware());

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
