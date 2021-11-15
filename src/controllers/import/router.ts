import util from 'util';
import { pipeline } from 'stream';
import Router, { IMiddleware } from 'koa-router';
import csvParse, { CsvError } from 'csv-parse';
import Joi from 'joi';
import { AppContext } from '../../types';
import { RespondContext } from '../../middlewares/respond';
import { WALLET_CSV_HEADERS } from './wallet/constants';
import { ProcessingContainer, createParseTransformer, createValidationTransformer } from './wallet/transformers';
import toArray from '../../utils/stream/pipeline/toArray';
import { createImporter, ImportError } from './wallet/importer';
import { accountSchema } from '../../models/account';
import { categorySchema } from '../../models/category';

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

  const importer = createImporter(ctx.db.model('account', accountSchema), ctx.db.model('category', categorySchema));
  const importedRecords: unknown[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const container of parsedRecords) {
    if (!container.parsed) throw new Error('Not received parsed record');
    try {
      const importedRecord = await importer(container.parsed);
      importedRecords.push({ ...container, imported: importedRecord });
    } catch (e) {
      if (e instanceof ImportError) {
        importedRecords.push({ ...container, errors: [{ message: e.message }] });
      } else {
        throw e;
      }
    }
  }

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
