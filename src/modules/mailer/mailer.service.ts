import { Inject, Injectable, Logger } from '@nestjs/common';
import { emailConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { ITemplatedCodeMail, ITemplatedData, ITemplatedLinkMail, ITemplates } from '@/modules/mailer/mailer.interfaces';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import Handlebars from 'handlebars';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { CONFIRM_EMAIL_MSG, EMAIL_ERR_MSG, EMAIL_MSG, REST_EMAIL_MSG } from '@/modules/auth/auth.constants';

@Injectable()
export class MailerService {
  private readonly sesClient: SESClient;
  private readonly templates: ITemplates;
  private readonly logger = new Logger(MailerService.name);

  constructor(
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
  ) {
    this.sesClient = new SESClient({
      region: this.emailConf.awsRegion,
      credentials: {
        accessKeyId: this.emailConf.awsAccessKey,
        secretAccessKey: this.emailConf.awsSecretAccessKey,
      },
    });

    this.templates = {
      confirmationLink: this.parseTemplate('confirmation-link.hbs'),
      confirmationCode: this.parseTemplate('confirmation-code.hbs'),
      resetPasswordLink: this.parseTemplate('reset-link.hbs'),
      resetPasswordCode: this.parseTemplate('reset-code.hbs'),
    };
  }

  private parseTemplate(templateName: string): Handlebars.TemplateDelegate<ITemplatedLinkMail | ITemplatedCodeMail> {
    const templateText = readFileSync(join(__dirname, 'templates', templateName), 'utf-8');

    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  public async sendEmail(to: string, subject: string, html: string, log?: string): Promise<void> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.emailConf.user,
    };

    try {
      await this.sesClient.send(new SendEmailCommand(params));
      this.logger.log(log ?? EMAIL_MSG);
    } catch (error) {
      throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, EMAIL_ERR_MSG, error.stack);
    }
  }

  public async sendConfirmationEmail(email: string, nickname: string, code: string): Promise<void> {
    const subject = 'Confirm your email';
    const ttlInMinutes = this.emailConf.ttl / 60;
    const html = this.templates.confirmationCode({ nickname, code, ttlInMinutes });

    await this.sendEmail(email, subject, html, CONFIRM_EMAIL_MSG);
  }

  public async sendResetPasswordEmail(email: string, nickname: string, code: string): Promise<void> {
    const subject = 'Reset your password';
    const ttlInMinutes = this.emailConf.ttl / 60;
    const html = this.templates.resetPasswordCode({ nickname, code, ttlInMinutes });

    await this.sendEmail(email, subject, html, REST_EMAIL_MSG);
  }
}
