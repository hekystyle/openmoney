export const WALLET_CSV_HEADERS = [
  'accountName',
  'categoryName',
  'currency',
  'amount',
  'refCurrencyAmount',
  'type',
  'paymentType',
  'paymentTypeLocal',
  'note',
  'date',
  'gpsLatitude',
  'gpsLongtitude',
  'gpsAccuracyInMeters',
  'monthsCountOfWarranty',
  'isTransfer',
  'payee',
  'labels',
  'envelopeId',
  'isCategoryCustom',
] as const;

export default WALLET_CSV_HEADERS;
