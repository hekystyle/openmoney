import { Transform } from 'stream';
import { getImportingWalletRecordSchema } from './validation';
import { parseImportingWalletRecord, ParseError } from './parsing';
import { ImportingWalletRecord, ParsedWalletRecord } from './types';

export interface ProcessingContainer {
  errors: { message: string }[];
  raw: ImportingWalletRecord;
  parsed?: ParsedWalletRecord;
}

export const createValidationTransformer = (onValidationError?: () => void) => new Transform({
  objectMode: true,
  writableObjectMode: true,
  readableObjectMode: true,
  transform: (chunk: unknown, enc, next) => {
    const validationResult = getImportingWalletRecordSchema().validate(chunk, {
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
      const parsed = parseImportingWalletRecord(chunk.raw);

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
