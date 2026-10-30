import { getAllBookings } from './_shared/backendStore.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const bookings = getAllBookings();
    return res.status(200).json({ bookings });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to fetch bookings' });
  }
}
