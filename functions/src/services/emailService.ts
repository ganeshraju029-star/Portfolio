/**
 * Email Service using Resend API
 * Handles all email communications for the portfolio
 */

import { Resend } from 'resend';
import { EmailData, AdminEmailData, VisitorEmailData } from '../types';
import { Config } from '../config/constants';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(Config.RESEND_API_KEY);
  }

  /**
   * Send email to admin about new connection request
   */
  async sendAdminEmail(data: AdminEmailData): Promise<void> {
    const html = this.generateAdminEmailTemplate(data.connection);
    
    try {
      await this.resend.emails.send({
        from: Config.FROM_EMAIL,
        to: Config.ADMIN_EMAIL,
        subject: '🚀 New Portfolio Connection Request',
        html,
        replyTo: data.connection.email
      });
      
      console.log(`Admin email sent for connection: ${data.connection.requestId}`);
    } catch (error) {
      console.error('Failed to send admin email:', error);
      throw new Error('Failed to send notification email');
    }
  }

  /**
   * Send auto-reply email to visitor
   */
  async sendVisitorEmail(data: VisitorEmailData): Promise<void> {
    const html = this.generateVisitorEmailTemplate(data.name);
    
    try {
      await this.resend.emails.send({
        from: Config.FROM_EMAIL,
        to: data.to,
        subject: 'Thanks for reaching out!',
        html
      });
      
      console.log(`Visitor email sent to: ${data.to}`);
    } catch (error) {
      console.error('Failed to send visitor email:', error);
      // Don't throw - visitor email failure shouldn't block the submission
    }
  }

  /**
   * Generate HTML template for admin email
   */
  private generateAdminEmailTemplate(connection: any): string {
    const createdAt = connection.createdAt.toDate().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Connection</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #10131a 0%, #1d2026 100%);
      color: #e1e2eb;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(50, 53, 60, 0.6);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid rgba(164, 230, 255, 0.15);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(164, 230, 255, 0.2);
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      background: linear-gradient(135deg, #a4e6ff 0%, #edb1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: linear-gradient(135deg, rgba(164, 230, 255, 0.2), rgba(237, 177, 255, 0.2));
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a4e6ff;
      margin-bottom: 5px;
    }
    .field-value {
      font-size: 16px;
      color: #e1e2eb;
      word-wrap: break-word;
    }
    .message-box {
      background: rgba(29, 32, 38, 0.8);
      padding: 20px;
      border-radius: 12px;
      border-left: 3px solid #a4e6ff;
      margin-top: 20px;
    }
    .priority-high {
      color: #ffb4ab;
    }
    .priority-medium {
      color: #edb1ff;
    }
    .priority-low {
      color: #a4e6ff;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(164, 230, 255, 0.2);
      font-size: 12px;
      color: #bbc9cf;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #a4e6ff 0%, #edb1ff 100%);
      color: #001f28;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">New Connection</span>
      <h1>🚀 Portfolio Connection Request</h1>
    </div>
    
    <div class="field">
      <div class="field-label">Request ID</div>
      <div class="field-value">${connection.requestId}</div>
    </div>
    
    <div class="field">
      <div class="field-label">Priority</div>
      <div class="field-value priority-${connection.priority}">${connection.priority.toUpperCase()}</div>
    </div>
    
    <div class="field">
      <div class="field-label">Name</div>
      <div class="field-value">${connection.name}</div>
    </div>
    
    <div class="field">
      <div class="field-label">Email</div>
      <div class="field-value">${connection.email}</div>
    </div>
    
    ${connection.company ? `
    <div class="field">
      <div class="field-label">Company</div>
      <div class="field-value">${connection.company}</div>
    </div>
    ` : ''}
    
    ${connection.subject ? `
    <div class="field">
      <div class="field-label">Subject</div>
      <div class="field-value">${connection.subject}</div>
    </div>
    ` : ''}
    
    <div class="field">
      <div class="field-label">Location</div>
      <div class="field-value">${connection.country} · ${connection.device} · ${connection.browser}</div>
    </div>
    
    <div class="field">
      <div class="field-label">Received</div>
      <div class="field-value">${createdAt}</div>
    </div>
    
    <div class="message-box">
      <div class="field-label" style="margin-bottom: 10px;">Message</div>
      <div class="field-value" style="white-space: pre-wrap;">${connection.message}</div>
    </div>
    
    ${connection.linkedin ? `
    <div class="field">
      <div class="field-label">LinkedIn</div>
      <div class="field-value"><a href="${connection.linkedin}" style="color: #a4e6ff;">${connection.linkedin}</a></div>
    </div>
    ` : ''}
    
    ${connection.phone ? `
    <div class="field">
      <div class="field-label">Phone</div>
      <div class="field-value">${connection.phone}</div>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>Sent from Ganesh Raju Portfolio</p>
      <p style="margin-top: 5px;">${createdAt}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate HTML template for visitor auto-reply
   */
  private generateVisitorEmailTemplate(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #10131a 0%, #1d2026 100%);
      color: #e1e2eb;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(50, 53, 60, 0.6);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid rgba(164, 230, 255, 0.15);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      background: linear-gradient(135deg, #a4e6ff 0%, #edb1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .content {
      font-size: 16px;
      line-height: 1.8;
    }
    .highlight {
      color: #a4e6ff;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(164, 230, 255, 0.2);
      font-size: 14px;
      color: #bbc9cf;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(164, 230, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for reaching out!</h1>
    </div>
    
    <div class="content">
      <p>Hello <span class="highlight">${name}</span>,</p>
      
      <p>Thank you for contacting me. I have successfully received your message and will review it shortly.</p>
      
      <p>I appreciate your interest and will respond as soon as possible.</p>
      
      <div class="signature">
        <p>Best Regards,</p>
        <p class="highlight">Ganesh Raju</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Ganesh Raju Portfolio</p>
      <p style="margin-top: 5px;">Engineer · Leader · Innovator</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export default EmailService;
