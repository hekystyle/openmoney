import { Transform } from 'stream';
import { getImportingWalletRecordSchema } from './validation';
import { parseImportingWalletRecord, ParseError } from './parsing';
import { ImportingWalletRecord, ParsedWalletRecord } from './types';

export interface Container {
  errors: { message: string }[];
  raw: ImportingWalletRecord;
  parsed?: ParsedWalletRecord;
}

export const validate = () => new Transform({
  objectMode: true,
  writableObjectMode: true,
  readableObjectMode: true,
  transform: (chunk, enc, next) => {
    const validationResult = getImportingWalletRecordSchema().validate(chunk, {
      abortEarly: false,
      allowUnknown: true,
    });
    return next(null, <Container>{ errors: validationResult.error?.details ?? [], raw: chunk });
  },
});

export const parse = () => new Transform({
  objectMode: true,
  writableObjectMode: true,
  readableObjectMode: true,
  transform: (chunk: Container, enc, next) => {
    if (chunk.errors.length > 0) return next(null, chunk);

    try {
      const parsed = parseImportingWalletRecord(chunk.raw);

      return next(null, { ...chunk, parsed });
    } catch (e) {
      if (e instanceof ParseError) {
        return next(null, { ...chunk, errors: [{ message: e.message }] });
      }
      if (e instanceof Error) return next(e);
      return next(new AggregateError([e], 'Unknown type of catched error'));
    }
  },
});

export const toJsonArray = () => {
  let insertLeadingComma = false;

  return new Transform({
    objectMode: false,
    writableObjectMode: true,
    readableObjectMode: false,
    construct: function construct(next) {
      this.push('[');
      next();
    },
    transform: (chunk, enc, next) => {
      const data = `${insertLeadingComma ? ',' : ''}${JSON.stringify(chunk)}`;
      if (!insertLeadingComma) insertLeadingComma = true;
      next(null, data);
    },
    flush: (next) => {
      next(null, ']');
    },
  });
};
