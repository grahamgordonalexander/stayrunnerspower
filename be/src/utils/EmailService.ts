import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      subject: subject,
      html: body,
    });
  }
}