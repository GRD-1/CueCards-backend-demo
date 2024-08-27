import { TemplateDelegate } from 'handlebars';

export interface ITemplatedLinkMail {
  nickname: string;
  link: string;
}

export interface ITemplatedCodeMail {
  nickname: string;
  code: string;
}

export type ITemplatedData = ITemplatedLinkMail | ITemplatedCodeMail;

export interface ITemplates {
  confirmationLink: TemplateDelegate<ITemplatedLinkMail>;
  resetPasswordLink: TemplateDelegate<ITemplatedLinkMail>;
  confirmationCode: TemplateDelegate<ITemplatedCodeMail>;
  resetPasswordCode: TemplateDelegate<ITemplatedCodeMail>;
}
