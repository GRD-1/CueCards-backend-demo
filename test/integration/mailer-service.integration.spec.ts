import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@/modules/mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';
import { emailConfig } from '@/config/configs/email.config';
import { SESClient } from '@aws-sdk/client-ses';
import { CONFIRM_EMAIL_SUBJ, RESET_PASS_SUBJ } from '@/modules/mailer/mailer.constants';
import { DEFAULT_PARAMS, getTemplate } from '@/integration/_fixtures/mailer-service.fixture';
import { EMAIL_ERR_MSG, EMAIL_INVALID_MSG } from '@/constants/messages.constants';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

jest.mock('@aws-sdk/client-ses', () => {
  return {
    SESClient: jest.fn(),
    SendEmailCommand: jest.fn().mockImplementation((input) => ({ input })),
  };
});

describe('MailerService Integration tests', () => {
  const { email, code, nickname } = DEFAULT_PARAMS;
  let mailerService: MailerService;
  let sesSendMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [emailConfig] })],
      providers: [MailerService],
    }).compile();

    mailerService = module.get<MailerService>(MailerService);

    sesSendMock = jest.fn();
    (SESClient.prototype.send as jest.Mock) = sesSendMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a confirmation email successfully', async () => {
    const payload = getTemplate(CONFIRM_EMAIL_SUBJ);

    sesSendMock.mockResolvedValue({});

    await mailerService.sendConfirmationEmail(email, code, nickname);

    expect(sesSendMock.mock.calls[0][0].input.Destination.ToAddresses).toContain(email);
    expect(sesSendMock.mock.calls[0][0].input.Message.Subject.Data).toBe(CONFIRM_EMAIL_SUBJ);
    expect(sesSendMock.mock.calls[0][0].input.Message.Body.Html.Data).toBe(payload);
  });

  it('should send a reset password email successfully', async () => {
    const payload = getTemplate(RESET_PASS_SUBJ);

    sesSendMock.mockResolvedValue({});

    await mailerService.sendResetPasswordEmail(email, code, nickname);

    expect(sesSendMock.mock.calls[0][0].input.Destination.ToAddresses).toContain(email);
    expect(sesSendMock.mock.calls[0][0].input.Message.Subject.Data).toBe(RESET_PASS_SUBJ);
    expect(sesSendMock.mock.calls[0][0].input.Message.Body.Html.Data).toBe(payload);
  });

  it('should handle SES MessageRejected error', async () => {
    sesSendMock.mockRejectedValueOnce({ name: 'MessageRejected' });

    const resp = mailerService.sendConfirmationEmail(email, code, nickname);

    await expect(resp).rejects.toMatchObject({
      code: CCBK_ERROR_CODES.BAD_REQUEST,
      message: EMAIL_INVALID_MSG,
    });
  });

  it('should handle SES ServiceUnavailable error', async () => {
    sesSendMock.mockRejectedValueOnce({ name: 'ServiceUnavailable' });

    const resp = mailerService.sendConfirmationEmail(email, code, nickname);

    await expect(resp).rejects.toMatchObject({
      code: CCBK_ERROR_CODES.SERVICE_UNAVAILABLE,
      message: EMAIL_ERR_MSG,
    });
  });
});
