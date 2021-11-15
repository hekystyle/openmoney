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
import { AdapterError, createTransactionAdapter } from './wallet/adapters';
import { createTransactionImporter, ImportError } from './importer';

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

  const parsedContainers = await pipelineAsync(stream, toArray) as ProcessingContainer[];

  if (!allItemsAreValid) return ctx.json(parsedContainers);

  const adapter = createTransactionAdapter();
  const importer = createTransactionImporter();

  const transactionContainersWithTriedImport = await Promise.all(parsedContainers.filter(
    (container) => container.parsed?.isTransfer === false,
  ).map(async (container) => {
    if (!container.parsed) throw new Error('Parsed record not received');

    try {
      const transaction = await adapter(container.parsed);
      return { ...container, transaction };
    } catch (e) {
      if (e instanceof AdapterError) {
        return { ...container, errors: [{ message: e.message }] };
      }
      throw e;
    }
  }).map(async (promise) => {
    const container = await promise;
    if (!container.transaction) return container;
    try {
      const transactionDocument = await importer(container.transaction);
      return { ...container, imported: transactionDocument };
    } catch (e) {
      if (e instanceof ImportError) {
        return { ...container, errors: [{ message: e.message }] };
      }
      throw e;
    }
  }));

  // TODO: handle transfers import

  return ctx.json(transactionContainersWithTriedImport);
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
