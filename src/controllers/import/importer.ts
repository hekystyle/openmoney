import { AccountModel } from '../../models/account';
import { CategoryModel } from '../../models/category';
import { ParsedRecord } from './wallet/types';

export class ImportError extends Error {}

/**
 * @throws {ImportError}
 */
export type Importer = (record: ParsedRecord) => Promise<void>;

export function createImporter(accounts: AccountModel, categories: CategoryModel): Importer {
  return async (rec) => {
    if (rec.isTransfer) throw new ImportError('Import of transfers is not currently supported.');

    const account = await accounts.findOne({ name: rec.accountName });
    if (account === null) {
      throw new ImportError(`Account not found: ${rec.accountName}`);
    }

    const category = await categories.findOne({ name: rec.categoryName });
    if (category === null) {
      throw new ImportError(`Category not found: ${rec.categoryName}`);
    }
    // TODO: complete
    throw new ImportError('Not implemented');
  };
}
