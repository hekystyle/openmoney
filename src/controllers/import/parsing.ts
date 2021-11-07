import { ImportingWalletRecord, ParsedWalletRecord, WalletRecordType } from './types';

function parseDate(date: string) {
  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Date parsing failed: ${date}`);
  }

  return new Date(timestamp);
}

function parseIsTransfer(is: string): boolean {
  switch (is) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`Not supported value: ${is}`);
  }
}

export function parseImportingWalletRecord(rec: ImportingWalletRecord): ParsedWalletRecord {
  return {
    ...rec,
    amount: parseFloat(rec.amount),
    monthsCountOfWarranty: parseFloat(rec.monthsCountOfWarranty),
    labels: rec.labels.split('|'),
    type: rec.type as WalletRecordType,
    date: parseDate(rec.date),
    isTransfer: parseIsTransfer(rec.isTransfer),
  };
}

export default parseImportingWalletRecord;
