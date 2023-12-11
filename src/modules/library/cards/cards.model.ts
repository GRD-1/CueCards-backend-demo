export class CardsModel {
  fs_language: number;
  fs_value: string;
  fs_meaning_variants?: string[];
  fs_wrong_meanings?: string[];
  fs_transcription: string;
  fs_synonims?: string[];
  fs_audio?: string;
  bs_language: number;
  bs_value: string;
  bs_meaning_variants?: string[];
  bs_wrong_meanings?: string[];
  bs_transcription: string;
  bs_synonims?: string[];
  bs_audio?: string;
  delete_mark?: boolean;
  tags?: string[];
}
