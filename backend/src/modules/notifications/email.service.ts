import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

export interface EmailTemplateData {
  recipientName?: string;
  jobTitle?: string;
  jobId?: string;
  companyName?: string;
  applicationId?: string;
  status?: string;
  message?: string;
  cvTitle?: string;
  senderName?: string;
  conversationId?: string;
  planName?: string;
  resetLink?: string;
  loginLink?: string;
  dashboardLink?: string;
  unsubscribeLink?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger('EmailService');

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // For development/testing, use a service like Ethereal Email or Mailtrap
    // For production, use SMTP providers like SendGrid, Mailgun, AWS SES, etc.
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: this.configService.get('SMTP_SECURE', false), // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER', 'your-email@example.com'),
        pass: this.configService.get('SMTP_PASS', 'your-password'),
      },
    });
  }

  private getEmailTemplates() {
    return {
      jobApplicationReceived: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Job Application Received</h2>
          <p>Dear {{recipientName}},</p>
          <p>You have received a new application for your job posting <strong>"{{jobTitle}}"</strong>.</p>
          <p><strong>Applicant:</strong> {{senderName}}</p>
          <p>Please review the application in your dashboard.</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Application</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      applicationStatusUpdate: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Status Update</h2>
          <p>Dear {{recipientName}},</p>
          <p>Your application for <strong>"{{jobTitle}}"</strong> at <strong>{{companyName}}</strong> has been updated.</p>
          <p><strong>New Status:</strong> {{status}}</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Details</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      jobAlert: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Job Match Found!</h2>
          <p>Dear {{recipientName}},</p>
          <p>Great news! We found a job that matches your profile.</p>
          <p><strong>Job Title:</strong> {{jobTitle}}</p>
          <p><strong>Company:</strong> {{companyName}}</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Apply Now</a>
          </div>
          <p>Don't miss this opportunity!</p>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      cvViewed: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your CV Has Been Viewed</h2>
          <p>Dear {{recipientName}},</p>
          <p>{{companyName}} has viewed your CV <strong>"{{cvTitle}}"</strong>.</p>
          <p>This is a great sign of interest! They might contact you soon.</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Update Your CV</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      newMessage: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Message Received</h2>
          <p>Dear {{recipientName}},</p>
          <p>You have received a new message from <strong>{{senderName}}</strong>.</p>
          <p><strong>Message:</strong> {{message}}</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reply Now</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      subscriptionExpired: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Subscription Expired</h2>
          <p>Dear {{recipientName}},</p>
          <p>Your {{planName}} subscription has expired.</p>
          <p>Renew your subscription to continue enjoying premium features and better job matching.</p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardLink}}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Renew Subscription</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CVKing!</h2>
          <p>Dear {{recipientName}},</p>
          <p>Welcome to CVKing! Your account has been successfully created.</p>
          <p>You can now start browsing jobs, creating your CV, and connecting with employers.</p>
          <div style="margin: 30px 0;">
            <a href="{{loginLink}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Get Started</a>
          </div>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,

      passwordReset: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Dear {{recipientName}},</p>
          <p>You have requested to reset your password.</p>
          <p>Click the link below to set a new password:</p>
          <div style="margin: 30px 0;">
            <a href="{{resetLink}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The CVKing Team</p>
        </div>
      `,
    };
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    data: EmailTemplateData,
  ): Promise<void> {
    try {
      const templates = this.getEmailTemplates();
      const template = templates[templateName];

      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      // Compile template with Handlebars
      const compiledTemplate = handlebars.compile(template);
      const html = compiledTemplate(data);

      // Add default data
      const emailData = {
        ...data,
        dashboardLink: data.dashboardLink || 'https://cvking.com/dashboard',
        loginLink: data.loginLink || 'https://cvking.com/login',
        unsubscribeLink:
          data.unsubscribeLink || 'https://cvking.com/unsubscribe',
      };

      const mailOptions = {
        from: this.configService.get(
          'EMAIL_FROM',
          '"CVKing" <noreply@cvking.com>',
        ),
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email sent successfully: ${info.messageId}`);
      this.logger.debug(`Email sent to: ${to}, subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error.message);
      throw error;
    }
  }

  // Specific email methods for different notification types
  async sendJobApplicationReceived(
    employerEmail: string,
    employerName: string,
    jobTitle: string,
    applicantName: string,
  ): Promise<void> {
    await this.sendEmail(
      employerEmail,
      'New Job Application Received',
      'jobApplicationReceived',
      {
        recipientName: employerName,
        jobTitle,
        senderName: applicantName,
      },
    );
  }

  async sendApplicationStatusUpdate(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    companyName: string,
    status: string,
  ): Promise<void> {
    await this.sendEmail(
      applicantEmail,
      'Application Status Update',
      'applicationStatusUpdate',
      {
        recipientName: applicantName,
        jobTitle,
        companyName,
        status,
      },
    );
  }

  async sendJobAlert(
    userEmail: string,
    userName: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    await this.sendEmail(userEmail, 'New Job Match Found!', 'jobAlert', {
      recipientName: userName,
      jobTitle,
      companyName,
    });
  }

  async sendCvViewed(
    jobSeekerEmail: string,
    jobSeekerName: string,
    companyName: string,
    cvTitle: string,
  ): Promise<void> {
    await this.sendEmail(
      jobSeekerEmail,
      'Your CV Has Been Viewed',
      'cvViewed',
      {
        recipientName: jobSeekerName,
        companyName,
        cvTitle,
      },
    );
  }

  async sendNewMessage(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    message: string,
  ): Promise<void> {
    await this.sendEmail(recipientEmail, 'New Message Received', 'newMessage', {
      recipientName,
      senderName,
      message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
    });
  }

  async sendSubscriptionExpired(
    userEmail: string,
    userName: string,
    planName: string,
  ): Promise<void> {
    await this.sendEmail(
      userEmail,
      'Subscription Expired',
      'subscriptionExpired',
      {
        recipientName: userName,
        planName,
      },
    );
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.sendEmail(userEmail, 'Welcome to CVKing!', 'welcome', {
      recipientName: userName,
    });
  }

  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL', 'https://cvking.com')}/reset-password?token=${resetToken}`;

    await this.sendEmail(userEmail, 'Password Reset Request', 'passwordReset', {
      recipientName: userName,
      resetLink,
    });
  }

  // Bulk email sending
  async sendBulkEmails(
    emails: Array<{
      to: string;
      subject: string;
      templateName: string;
      data: EmailTemplateData;
    }>,
  ): Promise<void> {
    const promises = emails.map((email) =>
      this.sendEmail(email.to, email.subject, email.templateName, email.data),
    );

    await Promise.allSettled(promises);
    this.logger.log(`Bulk email sent to ${emails.length} recipients`);
  }

  // Test email functionality
  async sendTestEmail(to: string): Promise<void> {
    await this.sendEmail(to, 'CVKing Email Test', 'welcome', {
      recipientName: 'Test User',
      message: 'This is a test email to verify your email configuration.',
    });
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed:', error.message);
      return false;
    }
  }
}
