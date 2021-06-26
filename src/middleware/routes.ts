import Router from "koa-router";
import { del, get, getAll, post, put } from "../controllers/categories";
import { RespondContext } from "./respond";

const root = new Router<{}, RespondContext>();
root.get('/', async ctx => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

const cats = new Router<{}, RespondContext>();
cats.prefix('/categories');
cats.get('/', getAll);
cats.get('/:id', get);
cats.post('/', post);
cats.put('/:id', put);
cats.delete('/:id', del);
root.use(cats.middleware());

export const router = () => root.middleware();
