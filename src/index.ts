import Koa from "koa";
import bodyParser from "koa-bodyparser";

import { respond } from "./middleware/respond";
import { router as getRouter } from "./middleware/routes";

const PORT = 3000;

const app = new Koa();

app.use(respond());
app.use(bodyParser());
app.use(getRouter());

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
