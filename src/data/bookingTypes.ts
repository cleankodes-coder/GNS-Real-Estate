import { GNS_CONFIG } from './gnsData';

export interface StoredBooking {
  bookingId: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  property: string;
  notes: string;
  emailStatus: string;
  whatsAppStatus: string;
  whatsAppUrl: string;
  timestamp: string;
}

export interface StoredLead {
  leadId: string;
  name: string;
  email: string;
  whatsapp: string;
  interest: string;
  timestamp: string;
}

export interface ClientWebsiteAction {
  type:
    | 'navigate_to_section'
    | 'show_properties'
    | 'get_property_details'
    | 'book_appointment'
    | 'save_lead_details'
    | 'end_call';
  path?: string;
  elementId?: string;
  params?: {
    location?: string;
    bedrooms?: string;
    max_budget?: number;
    type?: string;
  };
  propertySlug?: string;
  propertyId?: string;
  booking?: StoredBooking;
  lead?: StoredLead;
}

export interface ToolExecutionOutput {
  success: boolean;
  statusText: string;
  clientAction: ClientWebsiteAction;
  data: any;
  summaryForSara: string;
}

/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/**
 * Validates phone / WhatsApp number format (min 7 digits)
 */
export function isValidPhone(phone: string): boolean {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

/**
 * Prepares the formatted advisor WhatsApp dispatch link
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
  const advisorRaw = GNS_CONFIG.whatsapp;
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
