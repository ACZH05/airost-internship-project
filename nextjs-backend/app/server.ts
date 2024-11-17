// Import the cron task
import './script/cleanUpScript';

// Your existing Next.js server setup
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req:any, res:any) => {
    return handle(req, res);
  });

  server.listen(3000, (err:any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});