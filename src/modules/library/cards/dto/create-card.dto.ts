import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsNumber()
    fs_language: number;

  @IsString()
    fs_value: string;

  @IsArray()
  @IsString({ each: true })
    fs_meaning_variants?: string[];

  @IsArray()
  @IsString({ each: true })
    fs_wrong_meanings?: string[];

  @IsString()
    fs_transcription: string;

  @IsArray()
  @IsString({ each: true })
    fs_synonims?: string[];

  @IsString()
    fs_audio?: string;

  @IsNumber()
    bs_language: number;

  @IsString()
    bs_value: string;

  @IsArray()
  @IsString({ each: true })
    bs_meaning_variants?: string[];

  @IsArray()
  @IsString({ each: true })
    bs_wrong_meanings?: string[];

  @IsString()
    bs_transcription: string;

  @IsArray()
  @IsString({ each: true })
    bs_synonims?: string[];

  @IsString()
    bs_audio?: string;

  @IsBoolean()
    delete_mark?: boolean;

  @IsArray()
  @IsString({ each: true })
    tags?: string[];
}
