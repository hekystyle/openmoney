import Router from 'koa-router';
import {
  getCategory, getCategories, createCategory, updateCategory, deleteCustomer,
} from '../controllers/categories';
import importRouter from '../controllers/import/router';
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

root.use('/import', importRouter.middleware(), importRouter.allowedMethods());

export default () => root.middleware();
