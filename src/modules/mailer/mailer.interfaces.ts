import { TemplateDelegate } from 'handlebars';

export interface ITemplatedLinkMail {
  nickname: string;
  link: string;
  ttlInMinutes: number;
}

export interface ITemplatedCodeMail {
  nickname: string;
  code: string;
  ttlInMinutes: number;
}

export type ITemplatedData = ITemplatedLinkMail | ITemplatedCodeMail;

export interface ITemplates {
  confirmationLink: TemplateDelegate<ITemplatedLinkMail>;
  resetPasswordLink: TemplateDelegate<ITemplatedLinkMail>;
  confirmationCode: TemplateDelegate<ITemplatedCodeMail>;
  resetPasswordCode: TemplateDelegate<ITemplatedCodeMail>;
}
