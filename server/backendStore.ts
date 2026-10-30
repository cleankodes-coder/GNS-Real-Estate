import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { GNS_CONFIG } from '../src/data/gnsData';
import {
  StoredBooking,
  StoredLead,
  isValidEmail,
  isValidPhone,
} from '../src/data/bookingTypes';

export type { StoredBooking, StoredLead };
export { isValidEmail, isValidPhone };

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function ensureDataStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Sends notification email via SMTP if configured, or returns transparent status
 */
export async function sendBookingNotificationEmail(booking: {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  property: string;
  phone: string;
  email: string;
  notes?: string;
  timestamp: string;
}): Promise<{ sent: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.COMPANY_NOTIFICATION_EMAIL || user;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  // Check if SMTP credentials are real or placeholder
  if (
    !host ||
    !user ||
    !pass ||
    !receiver ||
    host.includes('example.com') ||
    pass.includes('your_') ||
    user.includes('example.com')
  ) {
    return {
      sent: false,
      message:
        'Email notifications not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in .env). Booking saved locally.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"GNS Receptionist" <${user}>`,
      to: receiver,
      subject: `New Viewing Appointment: ${booking.property} - ${booking.name} (${booking.bookingId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #E8E5DE;">
          <h2 style="color: #202020; border-bottom: 2px solid #D6A536; padding-bottom: 8px;">New Viewing Appointment Logged</h2>
          <p><strong>Booking Reference:</strong> <span style="font-family: monospace; color: #D6A536; font-size: 16px;">${booking.bookingId}</span></p>
          <p><strong>Client Name:</strong> ${booking.name}</p>
          <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
          <p><strong>Target Property / Topic:</strong> ${booking.property}</p>
          <p><strong>Phone / WhatsApp:</strong> ${booking.phone}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Client Notes:</strong> ${booking.notes || 'None specified'}</p>
          <hr style="border: none; border-top: 1px solid #E8E5DE; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666666;">Logged by GNS AI Receptionist (Sara) on ${booking.timestamp}.</p>
        </div>
      `,
    });

    return {
      sent: true,
      message: `Notification email successfully sent to ${receiver}.`,
    };
  } catch (err: any) {
    console.warn('SMTP delivery attempt failed:', err?.message || err);
    return {
      sent: false,
      message: `Email notification delivery failed: ${err?.message || 'SMTP error'}. Booking saved locally.`,
    };
  }
}

/**
 * Prepares the formatted advisor WhatsApp dispatch link and message using server env var
 */
export function prepareAdvisorWhatsApp(booking: {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  property: string;
  phone: string;
  email: string;
  notes?: string;
}): { advisorNumber: string; message: string; url: string } {
  const advisorRaw = process.env.ADVISOR_WHATSAPP_NUMBER || GNS_CONFIG.whatsapp;
  const advisorNumber = advisorRaw.replace(/[^\d+]/g, '');

  const messageText =
    `*New GNS Booking: ${booking.bookingId}*\n` +
    `Client: ${booking.name}\n` +
    `Date & Time: ${booking.date} at ${booking.time}\n` +
    `Property/Topic: ${booking.property}\n` +
    `Phone: ${booking.phone}\n` +
    `Email: ${booking.email}\n` +
    `Notes: ${booking.notes || 'None'}`;

  const cleanNum = advisorNumber.replace('+', '');
  const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(messageText)}`;

  return {
    advisorNumber,
    message: messageText,
    url,
  };
}

/**
 * Persists a new booking to data/bookings.json
 */
export function saveBookingToDatabase(bookingData: StoredBooking): StoredBooking {
  ensureDataStorage();
  let bookings: StoredBooking[] = [];
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    bookings = JSON.parse(raw);
  } catch {}
  bookings.unshift(bookingData);
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  return bookingData;
}

/**
 * Returns all stored bookings
 */
export function getAllBookings(): StoredBooking[] {
  ensureDataStorage();
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persists a new lead to data/leads.json
 */
export function saveLeadToDatabase(leadData: StoredLead): StoredLead {
  ensureDataStorage();
  let leads: StoredLead[] = [];
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    leads = JSON.parse(raw);
  } catch {}
  leads.unshift(leadData);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return leadData;
}

/**
 * Returns all stored leads
 */
export function getAllLeads(): StoredLead[] {
  ensureDataStorage();
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
