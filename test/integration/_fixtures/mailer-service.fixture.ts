import { readFileSync } from 'fs';
import { join } from 'path';
import { CONFIRM_EMAIL_SUBJ, RESET_PASS_SUBJ } from '@/modules/mailer/mailer.constants';
import Handlebars from 'handlebars';
import { ITemplatedData } from '@/modules/mailer/mailer.interfaces';

type SubjectType = typeof CONFIRM_EMAIL_SUBJ | typeof RESET_PASS_SUBJ;

export const DEFAULT_PARAMS = {
  email: 'test@test.com',
  code: '123456',
  nickname: 'TestUser',
  ttlInMinutes: 15,
};

export const TEMPLATE_CONFIG = {
  [CONFIRM_EMAIL_SUBJ]: {
    subject: CONFIRM_EMAIL_SUBJ,
    template: 'confirmation-code.hbs',
    ...DEFAULT_PARAMS,
  },
  [RESET_PASS_SUBJ]: {
    subject: RESET_PASS_SUBJ,
    template: 'reset-code.hbs',
    ...DEFAULT_PARAMS,
  },
};

export function getTemplate(config: SubjectType): string {
  const { ttlInMinutes, code, nickname, template } = TEMPLATE_CONFIG[config];
  const path = `../../../src/modules/mailer/templates/`;
  const templateText = readFileSync(join(__dirname, path, template), 'utf-8');
  const hbsTemplate = Handlebars.compile<ITemplatedData>(templateText, { strict: true });

  return hbsTemplate({ nickname, code, ttlInMinutes });
}
