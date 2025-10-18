
export enum Classification {
  Spam = 'Spam',
  Ham = 'Ham',
}

export interface ClassificationResult {
  classification: Classification;
  probability: number;
}

export interface HistoryEntry extends ClassificationResult {
  id: string;
  message: string;
}
