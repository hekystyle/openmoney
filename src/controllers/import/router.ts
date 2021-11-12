import Router, { IMiddleware } from 'koa-router';
import csvParse, { CsvError } from 'csv-parse';
import Joi from 'joi';
import { AppContext } from '../../types';
import { RespondContext } from '../../middlewares/respond';
import { walletCsvHeaders } from './constants';
import { parse, toJsonArray, validate } from './transformers';

const importAction: IMiddleware<{}, AppContext> = async (ctx) => {
  const stream = ctx.req.pipe(csvParse({
    delimiter: ';',
    fromLine: 2,
    columns: [...walletCsvHeaders],
  }))
    .pipe(validate())
    .pipe(parse())
    .pipe(toJsonArray());

  ctx.json(stream);
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
