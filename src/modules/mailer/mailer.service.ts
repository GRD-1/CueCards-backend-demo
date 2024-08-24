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
import Handlebars from 'handlebars';
import sesTransport from 'nodemailer-ses-transport';

@Injectable()
export class MailerService {
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly templates: ITemplates;
  private readonly logger = new Logger(MailerService.name);

  constructor(
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
  ) {
    this.transport = createTransport(
      sesTransport({
        accessKeyId: this.emailConf.awsAccessKey!,
        secretAccessKey: this.emailConf.awsSecretAccessKey!,
        region: this.emailConf.awsRegion!,
      }),
    );
    this.templates = {
      confirmation: this.parseTemplate('confirmation.hbs'),
      resetPassword: this.parseTemplate('reset-password.hbs'),
    };
  }

  private parseTemplate(templateName: string): Handlebars.TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(join(__dirname, 'templates', templateName), 'utf-8');

    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  public async sendEmail(to: string, subject: string, html: string, log?: string): Promise<void> {
    await this.transport
      .sendMail({
        from: this.emailConf.user,
        to,
        subject,
        html,
      })
      .then(() => this.logger.log(log ?? 'A confirmation email was sent.'))
      .catch((error) => {
        this.logger.error(`Failed to send email: ${error.message}`, error.stack);
        throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Confirmation email was not sent', error.stack);
      });
  }

  public async sendConfirmationEmail(email: string, nickname: string, token: string): Promise<void> {
    const subject = 'Confirm your email';
    const html = this.templates.confirmation({
      nickname,
      link: `https://${this.appConf.domain}/api/auth/confirm/?token=${token}`,
    });
    await this.sendEmail(email, subject, html, 'A new confirmation email was sent.');
  }

  public async sendResetPasswordEmail(email: string, nickname: string, token: string): Promise<void> {
    const subject = 'Reset your password';
    const html = this.templates.resetPassword({
      nickname,
      link: `https://${this.appConf.domain}/api/auth/reset-password?token=${token}`,
    });
    await this.sendEmail(email, subject, html, 'A new reset password email was sent.');
  }
}
