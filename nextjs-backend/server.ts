import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { cleanupExpiredCodes } from './script/cleanUpScript'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // Run cleanup when server starts
  cleanupExpiredCodes().catch(error => {
    console.error('Cleanup error:', error)
  })

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  });

  server.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
});