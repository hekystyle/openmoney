import Joi from 'joi';
import { RawRecord, RecordType } from './types';

const getRawRecordSchema = () => Joi.object<
RawRecord,
false,
RawRecord
>({
  accountName: Joi.string().required(),
  amount: Joi.number().required(),
  categoryName: Joi.string().required(),
  currency: Joi.string().case('upper').required(),
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
  type: Joi.string().valid(RecordType.Income, RecordType.Expenses).required(),
});

/**
 * @throws {Joi.ValidationError}
 */
export function validateRawRecord(record: RawRecord): void {
  const validationResult = getRawRecordSchema().validate(record, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (validationResult.error) throw validationResult.error;
}

export default validateRawRecord;
