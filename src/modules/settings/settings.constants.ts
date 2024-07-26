import { SettingsInterface } from '@/modules/settings/settings.interface';

export const DEFAULT_SETTINGS: SettingsInterface = {
  appLanguage: 'ru',
  trainingLanguage: 'en',
  notifications: true,
  hints: true,
  voicing: true,
  darkMode: false,
};
