import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { database } from './middlewares/database';

import { respond } from './middlewares/respond';
import { router, allowedMethods } from './middlewares/routes';

const PORT = 3000;

const app = new Koa();

app.use(logger())
  .use(database())
  .use(respond())
  .use(bodyParser())
  .use(router())
  .use(allowedMethods());

// eslint-disable-next-line no-console
console.log('Creating HTTP server ...');
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${PORT}`);
});
