import Router from 'koa-router';
import importRouter from '../controllers/import/router';
import { AppContext } from '../types';
import accountsRouter from '../controllers/accounts/router';
import categoriesRouter from '../controllers/categories/router';

const root = new Router<{}, AppContext>();
root.get('/', async (ctx) => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

root.use('/categories', categoriesRouter.middleware(), categoriesRouter.allowedMethods());

root.use('/import', importRouter.middleware(), importRouter.allowedMethods());
root.use('/accounts', accountsRouter.middleware(), accountsRouter.allowedMethods());

export default () => root.middleware();
