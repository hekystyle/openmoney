export interface ImportedItemResult {
  status: 'ok' | 'error';
  errors?: Array<{ message: string }>;
  data: Record<string, string>;
}

export type ImportResult = Array<ImportedItemResult>;
