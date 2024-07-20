export class SettingsEntity {
  id: number;
  userId: number;
  appLanguage: string;
  trainingLanguage: string;
  notifications: boolean;
  hints: boolean;
  voicing: boolean;
  darkMode: boolean;
}
