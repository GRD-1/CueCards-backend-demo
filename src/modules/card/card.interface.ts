export interface CardInterface {
  id?: number;
  authorId: number | null;
  fsLanguage: string;
  fsValue: string;
  fsDescription: string;
  fsMeaningVariants: string[];
  fsWrongMeanings: string[];
  fsTranscription: string;
  fsSynonyms: string[];
  fsAudio: string;
  fsHint: string;
  bsLanguage: string;
  bsValue: string;
  bsDescription: string;
  bsMeaningVariants: string[];
  bsWrongMeanings: string[];
  bsTranscription: string;
  bsSynonyms: string[];
  bsAudio: string;
  bsHint: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deleteMark: boolean;
}
