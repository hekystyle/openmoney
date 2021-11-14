import util from 'util';
import { pipeline } from 'stream';
import Router, { IMiddleware } from 'koa-router';
import csvParse, { CsvError } from 'csv-parse';
import Joi from 'joi';
import { AppContext } from '../../types';
import { RespondContext } from '../../middlewares/respond';
import { WALLET_CSV_HEADERS } from './constants';
import { ProcessingContainer, createParseTransformer, createValidationTransformer } from './transformers';
import toArray from '../../utils/stream/pipeline/toArray';
import { ImportError } from './importer';

const pipelineAsync = util.promisify(pipeline);

const importAction: IMiddleware<{}, AppContext> = async (ctx) => {
  let allItemsAreValid = true;

  const stream = ctx.req.pipe(csvParse({
    delimiter: ';',
    fromLine: 2,
    columns: [...WALLET_CSV_HEADERS],
  }))
    .pipe(createValidationTransformer(() => { allItemsAreValid = false; }))
    .pipe(createParseTransformer(() => { allItemsAreValid = false; }));

  const parsedRecords = await pipelineAsync(stream, toArray) as ProcessingContainer[];

  if (!allItemsAreValid) return ctx.json(parsedRecords);

  const importedRecords = parsedRecords.map((parsedRecord) => {
    try {
      throw new ImportError('Import is not currently supported.');
    } catch (e) {
      if (e instanceof ImportError) {
        return { ...parsedRecord, errors: [{ message: e.message }] };
      }
      throw e;
    }
  });

  return ctx.json(importedRecords);
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
