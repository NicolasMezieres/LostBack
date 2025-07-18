import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: process.env.MAILER_SECURE === 'false',
      auth: {
        user: this.config.get('SMTP_EMAIL'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async accountConfirmation(user: User, token: string) {
    const url = `${process.env.FRONT_URL}?token=${token}`;
    const emailHTML = `<h1>Confirmation your email.</h1>
    <p>${user.username}</p>
    <p>Use this link <a href=${url}>here</a> for activate your account</p>`;
    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: user.email,
      subject: 'Validate your account',
      html: emailHTML,
    });
  }
  async forgetPassword(user: User, token: string) {
    const url = `${process.env.FRONT_URL}forgetPassword/?token=${token}`;
    const emailHTML = `<h1>Hello ${user.username}</h1>
    <p>You received this email it's because you are a red fish and you forget your password</p>
    <p>If this mail is not your decision please ignore that</p>
    <p>For reset your password click <a href=${url}>here</a> </p>`;
    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: user.email,
      subject: 'Reset your password',
      html: emailHTML,
    });
  }
}
