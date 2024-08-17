import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { appConfig, emailConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { ITemplatedData, ITemplates } from '@/modules/mailer/mailer.interfaces';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { IUser } from '@/modules/user/user.interface';
import Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly templates: ITemplates;
  private readonly logger: Logger;
  private readonly email: string;
  private readonly domain: string;

  constructor(
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
  ) {
    this.transport = createTransport(this.emailConf);
    this.templates = {
      confirmation: MailerService.parseTemplate('confirmation.hbs'),
      resetPassword: MailerService.parseTemplate('reset-password.hbs'),
    };
    this.email = `"My App" <${emailConf.user}>`;
    this.domain = this.appConf.domain!;
    this.logger = new Logger(MailerService.name);
  }

  private static parseTemplate(templateName: string): Handlebars.TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(join(__dirname, 'templates', templateName), 'utf-8');

    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  public sendEmail(to: string, subject: string, html: string, log?: string): void {
    this.transport
      .sendMail({
        from: this.email,
        to,
        subject,
        html,
      })
      .then(() => this.logger.log(log ?? 'A new email was sent.'))
      .catch((error) => {
        throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Email was not sent', error);
      });
  }

  public sendConfirmationEmail(user: IUser, token: string): void {
    const { email, nickname } = user;
    const subject = 'Confirm your email';
    const html = this.templates.confirmation({
      nickname,
      link: `https://${this.domain}/auth/confirm/${token}`,
    });
    this.sendEmail(email, subject, html, 'A new confirmation email was sent.');
  }

  public sendResetPasswordEmail(user: IUser, token: string): void {
    const { email, nickname } = user;
    const subject = 'Reset your password';
    const html = this.templates.resetPassword({
      nickname,
      link: `https://${this.domain}/auth/reset-password/${token}`,
    });
    this.sendEmail(email, subject, html, 'A new reset password email was sent.');
  }
}
