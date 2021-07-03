import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { database } from './middlewares/database';

import { respond } from './middlewares/respond';
import router from './middlewares/routes';

const PORT = 3000;

const app = new Koa();

app.use(database());
app.use(respond());
app.use(bodyParser());
app.use(router());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${PORT}`);
});
