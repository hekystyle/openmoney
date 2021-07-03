import Router from 'koa-router';
import {
  del, getOne, getAll, create, update,
} from '../controllers/categories';
import { AppContext } from '../types';

const root = new Router<{}, AppContext>();
root.get('/', async (ctx) => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

const cats = new Router<{}, AppContext>();
cats.prefix('/categories');
cats.get('/', getAll);
cats.get('/:id', getOne);
cats.post('/', create);
cats.put('/:id', update);
cats.delete('/:id', del);
root.use(cats.middleware());

export default () => root.middleware();
