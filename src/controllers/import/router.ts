import Router, { IMiddleware } from 'koa-router';
import { CsvError } from 'csv-parse';
import Joi from 'joi';
import { AppContext } from '../../types';
import { RespondContext } from '../../middlewares/respond';
import wallet from './wallet';

const importAction: IMiddleware<{}, AppContext> = async (ctx) => {
  ctx.json(await wallet.importFile(ctx.req));
};

const handleError: IMiddleware<{}, RespondContext> = async (ctx, next) => {
  try {
    return await next();
  } catch (e) {
    if (e instanceof CsvError) return ctx.badRequest({ code: e.code, message: e.message });
    if (e instanceof Joi.ValidationError) {
      return ctx.badRequest({ message: e.message, details: e.details });
    }
    throw e;
  }
};

const router = new Router<{}, AppContext>();

router.post('/', handleError, importAction);

export default router;
