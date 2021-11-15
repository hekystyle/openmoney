import { Transaction, TransactionDocument, TransactionModel } from '../../models/transaction';

export class ImportError extends Error {}

/**
 * @throws {ImportError}
 */
export type TransactionImporter = (transaction: Transaction) => Promise<TransactionDocument>;

export function createTransactionImporter(transactions: TransactionModel): TransactionImporter {
  return async (transaction) => {
    const {
      accountID, categoryID, date, amount,
    } = transaction;

    const count = await transactions.count({
      accountID, categoryID, date, amount,
    });

    if (count > 0) {
      throw new ImportError('Already imported');
    }

    return transactions.create(transaction);
  };
}
