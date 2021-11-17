import { accountModel } from '../../models/account';
import { Transaction, TransactionDocument, transactionModel } from '../../models/transaction';
import { Transfer, TransferDocument, transferModel } from '../../models/transfer';

export class ImportError extends Error {}

/**
 * @throws {ImportError}
 */
export type TransactionImporter = (transaction: Transaction) => Promise<TransactionDocument>;

export const importTransaction: TransactionImporter = async (transaction) => {
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

export type TransferImporter = (transfer: Transfer) => Promise<TransferDocument>;

export const importTransfer: TransferImporter = async (transfer) => {
  const { date, amount } = transfer;

  let transferDocument = await transferModel.findOne({ date, amount });

  if (transferDocument !== null) return transferDocument;

  const accountDocument = await accountModel.findById(transfer.accountID);
  if (accountDocument === null) {
    throw new Error(`Account not found by ID: ${transfer.accountID}`);
  }

  accountDocument.balance -= transfer.amount;

  transferDocument = await transferModel.create(transfer);
  await accountDocument.save();

  return transferDocument;
};
