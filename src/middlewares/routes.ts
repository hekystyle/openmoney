import Router from 'koa-router';
import {
  getCategory, getCategories, createCategory, updateCategory, deleteCustomer,
} from '../controllers/categories';
import { AppContext } from '../types';

const root = new Router<{}, AppContext>();
root.get('/', async (ctx) => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

const cats = new Router<{}, AppContext>();
cats.prefix('/categories');
cats.get('/', getCategories);
cats.get('/:id', getCategory);
cats.post('/', createCategory);
cats.put('/:id', updateCategory);
cats.delete('/:id', deleteCustomer);
root.use(cats.middleware());

export default () => root.middleware();
