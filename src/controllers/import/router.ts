import Router, { IMiddleware } from 'koa-router';
import csvParse, { CsvError } from 'csv-parse';
import util from 'util';
import stream from 'stream';
import Joi from 'joi';
import { AppContext } from '../../types';
import toArray from '../../utils/stream/pipeline/toArray';
import { RespondContext } from '../../middlewares/respond';
import { walletCsvHeaders } from './constants';
import { getImportingWalletRecordSchema } from './validation';
import { ImportingWalletRecord } from './types';
import { parseImportingWalletRecord } from './parsing';

const pipelineAsync = util.promisify(stream.pipeline);

const importAction: IMiddleware<{}, AppContext> = async (ctx) => {
  const rows = await pipelineAsync(
    ctx.req,
    csvParse({
      delimiter: ';',
      fromLine: 2,
      columns: [...walletCsvHeaders],
    }),
    toArray(),
  );

  const validationResult = Joi.array()
    .items(getImportingWalletRecordSchema())
    .validate(rows, {
      abortEarly: false,
      allowUnknown: true,
    });

  if (validationResult.error) throw validationResult.error;

  const validatedRows = rows as ImportingWalletRecord[];

  ctx.ok(validatedRows.map(parseImportingWalletRecord));
};

const handleCsvError: IMiddleware<{}, RespondContext> = async (ctx, next) => {
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

router.post('/', handleCsvError, importAction);

export default router;
