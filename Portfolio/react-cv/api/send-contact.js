/**
 * Vercel serverless: sends contact form submission to your Gmail.
 * Set env: GMAIL_USER (your Gmail), GMAIL_APP_PASSWORD (Google App Password).
 */

import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = body ? JSON.parse(body) : {};
    } catch (_) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body.' });
    }
  }
  const { name, email, message } = body || {};
  const n = (name || '').trim();
  const e = (email || '').trim();
  const m = (message || '').trim();

  if (!n || !e || !m) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
  }

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
    return res.status(500).json({
      ok: false,
      error: 'Email not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel environment variables.',
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    replyTo: e,
    subject: `Portfolio – New message from ${n}`,
    text: `Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(n)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(e)}">${escapeHtml(e)}</a></p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;background:#f1f5f9;padding:12px;border-radius:8px;">${escapeHtml(m)}</pre>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, message: 'Message sent.' });
  } catch (err) {
    console.error('Send mail error:', err.message);
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email. Check Gmail App Password and try again.',
    });
  }
}

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
