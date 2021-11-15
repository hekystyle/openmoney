import Joi from 'joi';
import { ImportingWalletRecord as IImportingWalletRecord, WalletRecordType } from './types';

export const getImportingWalletRecordSchema = () => Joi.object<
IImportingWalletRecord,
false,
IImportingWalletRecord
>({
  accountName: Joi.string().required(),
  amount: Joi.number().required(),
  categoryName: Joi.string().required(),
  currency: Joi.string().required(),
  date: Joi.date().required(),
  envelopeId: Joi.number().required(),
  gpsAccuracyInMeters: Joi.number().allow('').required(),
  gpsLatitude: Joi.number().allow('').required(),
  gpsLongtitude: Joi.number().allow('').required(),
  isCategoryCustom: Joi.bool().required(),
  isTransfer: Joi.bool().required(),
  labels: Joi.string().allow('').required(),
  monthsCountOfWarranty: Joi.number().required(),
  note: Joi.string().allow('').required(),
  payee: Joi.string().allow('').required(),
  paymentType: Joi.string().required(),
  paymentTypeLocal: Joi.string().required(),
  refCurrencyAmount: Joi.string().required(),
  type: Joi.string().valid(WalletRecordType.Income, WalletRecordType.Expenses).required(),
});

export default getImportingWalletRecordSchema;
