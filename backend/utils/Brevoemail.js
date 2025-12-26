// brevo.service.js

import Brevo from '@getbrevo/brevo';
export const sendMail = async (to, subject, html) => {
  try {
    console.log('Attempting to send email to:', to);
    console.log('Subject:', subject);
    console.log('Using Brevo API Key:', process.env.BREVO_API_KEY ? '***' + process.env.BREVO_API_KEY.slice(-4) : 'NOT FOUND');
    console.log('Using Sender Email:', process.env.BREVO_SENDER_EMAIL || 'NOT FOUND');

    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not defined in environment variables');
    }
    if (!process.env.BREVO_SENDER_EMAIL) {
      throw new Error('BREVO_SENDER_EMAIL is not defined in environment variables');
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendEmail = new Brevo.SendSmtpEmail();
    sendEmail.sender = { email: process.env.BREVO_SENDER_EMAIL };
    sendEmail.to = [{ email: to }];
    sendEmail.subject = subject;
    sendEmail.htmlContent = html;

    console.log('Sending email with data:', {
      to: sendEmail.to,
      subject: sendEmail.subject,
      sender: sendEmail.sender,
      contentLength: html?.length || 0
    });

    const result = await apiInstance.sendTransacEmail(sendEmail);
    console.log('Email sent successfully:', {
      messageId: result?.messageId,
      response: result?.response?.body
    });
    
    return result;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

