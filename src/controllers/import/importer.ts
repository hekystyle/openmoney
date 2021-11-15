import { accountModel } from '../../models/account';
import { Transaction, TransactionDocument, transactionModel } from '../../models/transaction';

export class ImportError extends Error {}

/**
 * @throws {ImportError}
 */
export type TransactionImporter = (transaction: Transaction) => Promise<TransactionDocument>;

export function createTransactionImporter(): TransactionImporter {
  return async (transaction) => {
    const {
      accountID, categoryID, date, amount,
    } = transaction;

    const count = await transactionModel.countDocuments({
      accountID, categoryID, date, amount,
    });

    if (count > 0) {
      throw new ImportError('Already imported');
    }

    const transactionDocument = await transactionModel.create(transaction);

    const account = await accountModel.findById(transaction.accountID);
    if (account === null) {
      throw new Error(`Account not found by ID: ${transaction.accountID}`);
    }

    account.balance += transaction.amount;

    await account.save();

    return transactionDocument;
  };
}
