import { Transform } from 'stream';
import { getRawRecordSchema } from './validation';
import { parseRawRecord, ParseError } from './parsing';
import { RawRecord, ParsedRecord } from './types';
import { Transaction, TransactionDocument } from '../../../models/transaction';

export interface ProcessingContainer {
  errors: { message: string }[];
  raw: RawRecord;
  parsed?: ParsedRecord;
  transaction?: Transaction;
  imported?: TransactionDocument;
}

export const createValidationTransformer = (onValidationError?: () => void) => new Transform({
  objectMode: true,
  writableObjectMode: true,
  readableObjectMode: true,
  transform: (chunk: unknown, enc, next) => {
    const validationResult = getRawRecordSchema().validate(chunk, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (onValidationError && validationResult.error) onValidationError();
    return next(null, <ProcessingContainer>{
      errors: validationResult.error?.details ?? [],
      raw: chunk,
    });
  },
});

export const createParseTransformer = (onParseError?: () => void) => new Transform({
  objectMode: true,
  writableObjectMode: true,
  readableObjectMode: true,
  transform: (chunk: ProcessingContainer, enc, next) => {
    if (chunk.errors.length > 0) return next(null, chunk);

    try {
      const parsed = parseRawRecord(chunk.raw);

      return next(null, { ...chunk, parsed });
    } catch (e) {
      if (e instanceof ParseError) {
        if (onParseError) onParseError();
        return next(null, { ...chunk, errors: [{ message: e.message }] });
      }
      if (e instanceof Error) return next(e);
      return next(new Error(JSON.stringify(e)));
    }
  },
});
