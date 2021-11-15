import { ImportingWalletRecord, ParsedWalletRecord, WalletRecordType } from './types';

export class ParseError extends Error {}

function parseDate(date: string) {
  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) {
    throw new ParseError(`Invalid date format: ${date}`);
  }

  return new Date(timestamp);
}

function parseBool(is: string): boolean {
  switch (is) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new ParseError(`Not supported value: ${is}`);
  }
}

export function parseImportingWalletRecord(rec: ImportingWalletRecord): ParsedWalletRecord {
  const {
    accountName, categoryName, currency, note, payee,
  } = rec;
  return {
    accountName,
    categoryName,
    currency,
    note,
    payee,
    amount: parseFloat(rec.amount),
    monthsCountOfWarranty: parseFloat(rec.monthsCountOfWarranty),
    labels: rec.labels.split('|'),
    type: rec.type as WalletRecordType,
    date: parseDate(rec.date),
    isTransfer: parseBool(rec.isTransfer),
  };
}

export default parseImportingWalletRecord;
