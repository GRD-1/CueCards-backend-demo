export class CardReference {
  cardId: number;
  userId: number;
  fs_value: string;
  bs_value: string;
  fsHide?: boolean;
  bsHide?: boolean;
}

export class DictionaryModel {
  dictionaryId: number;
  title: string;
  owner: number;
  tags?: string[];
  cardReferences?: CardReference[];
}
