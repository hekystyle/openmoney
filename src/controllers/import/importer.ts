import { ParsedWalletRecord } from './types';

export class ImportError extends Error {}

/**
 * @throws {ImportError}
 */
export type Importer = (record: ParsedWalletRecord) => Promise<void>;

// TODO: writeimplementation
