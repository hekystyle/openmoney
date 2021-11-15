import { accountModel } from '../../../models/account';
import { categoryModel } from '../../../models/category';
import { labelModel } from '../../../models/label';
import { Transaction } from '../../../models/transaction';
import { ParsedRecord } from './types';

export class AdapterError extends Error {}

/**
 * @throws {AdapterError}
 */
export type TransactionAdapter = (record: ParsedRecord) => Promise<Transaction>;

export function createTransactionAdapter(): TransactionAdapter {
  return async (rec): Promise<Transaction> => {
    if (rec.isTransfer) throw new Error('Transfer adaption is not supported.');

    const account = await accountModel.findOne({ name: rec.accountName });
    if (account === null) {
      throw new AdapterError(`Account not found: ${rec.accountName}`);
    }

    if (account.currency !== rec.currency) {
      throw new AdapterError(`Account currency ${account.currency} does not match record currency: ${rec.currency}`);
    }

    const category = await categoryModel.findOne({ name: rec.categoryName });
    if (category === null) {
      throw new AdapterError(`Category not found: ${rec.categoryName}`);
    }

    const labelDocuments = await Promise.all(rec.labels.map(async (labelName) => {
      const label = await labelModel.findOne({ name: labelName });
      if (label === null) {
        throw new AdapterError(`Label not found: ${labelName}`);
      }
      return label;
    }));

    return {
      // eslint-disable-next-line no-underscore-dangle
      accountID: account._id,
      // eslint-disable-next-line no-underscore-dangle
      categoryID: category._id,
      amount: rec.amount,
      date: rec.date,
      note: rec.note,
      // eslint-disable-next-line no-underscore-dangle
      labels: labelDocuments.map((document) => document._id),
      counterparty: rec.payee,
      monthsCountOfWarranty: rec.monthsCountOfWarranty,
    };
  };
}
