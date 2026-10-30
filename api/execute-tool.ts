import { executeWebsiteTool } from './_shared/toolExecutor.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { name, args } = req.body || {};
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Tool name is required.' });
    }

    const output = await executeWebsiteTool(name, args || {});
    return res.status(200).json(output);
  } catch (err: any) {
    console.error('Error executing tool serverless:', err);
    return res.status(400).json({
      success: false,
      error: err?.message || 'Tool execution failed',
      statusText: `Error: ${err?.message || 'Failed to execute tool'}`,
    });
  }
}
