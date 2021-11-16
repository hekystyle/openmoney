import util from 'util';
import { pipeline, Readable } from 'stream';
import csvParse from 'csv-parse';
import { WALLET_CSV_HEADERS } from './constants';
import { ProcessingContainer, createParseTransformer, createValidationTransformer } from './transformers';
import toArray from '../../../utils/stream/pipeline/toArray';
import { AdapterError, createTransactionAdapter } from './adapters';
import { createTransactionImporter, ImportError } from '../importer';
import { ImportResult } from '../types';

const pipelineAsync = util.promisify(pipeline);

export default async function importFile(file: Readable): Promise<ImportResult> {
  let allItemsAreValid = true;

  const stream = file.pipe(csvParse({
    delimiter: ';',
    fromLine: 2,
    columns: [...WALLET_CSV_HEADERS],
  }))
    .pipe(createValidationTransformer(() => { allItemsAreValid = false; }))
    .pipe(createParseTransformer(() => { allItemsAreValid = false; }));

  const parsedContainers = await pipelineAsync(stream, toArray) as ProcessingContainer[];

  if (!allItemsAreValid) return parsedContainers;

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

  return transactionContainersWithTriedImport;
}
