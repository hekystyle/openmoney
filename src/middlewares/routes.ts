import Router from 'koa-router';
import importRouter from '../controllers/import/router';
import { AppContext } from '../types';
import accountsRouter from '../controllers/accounts/router';
import categoriesRouter from '../controllers/categories/router';
import usersRouter from '../controllers/users/router';

const root = new Router<{}, AppContext>();
root.get('/', async (ctx) => {
  ctx.body = `[${new Date().toISOString()}] Server is running and healthy.`;
});

root.use('/categories', categoriesRouter.middleware(), categoriesRouter.allowedMethods());

root.use('/import', importRouter.middleware(), importRouter.allowedMethods());
root.use('/accounts', accountsRouter.middleware(), accountsRouter.allowedMethods());
root.use('/users', usersRouter.middleware(), usersRouter.allowedMethods());

export const router = () => root.middleware();
export const allowedMethods = () => root.allowedMethods();
