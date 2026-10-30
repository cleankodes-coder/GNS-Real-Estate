import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import tokenHandler from './api/token';
import chatHandler from './api/chat';
import ttsHandler from './api/tts';
import bookingsHandler from './api/bookings';
import leadsHandler from './api/leads';
import executeToolHandler from './api/execute-tool';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

// API Endpoints matching Vercel Serverless Functions
app.all('/api/token', (req, res) => tokenHandler(req, res));
app.all('/api/chat', (req, res) => chatHandler(req, res));
app.all('/api/tts', (req, res) => ttsHandler(req, res));
app.all('/api/bookings', (req, res) => bookingsHandler(req, res));
app.all('/api/leads', (req, res) => leadsHandler(req, res));
app.all('/api/execute-tool', (req, res) => executeToolHandler(req, res));

// Mount Vite middleware in development or serve static build in production
async function startServer() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`GNS Real Estate full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
