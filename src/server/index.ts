import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

import init from './init'
import clean from './clean'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Initialize
Object.defineProperty(global, 'tanatloc', { value: {} })
init().catch((err) => {
  console.error('Initialize failed!')
  console.error(err)

  process.exit(1)
})

// Server
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.info(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})

// Clean
const handleExit = (code: number): void => {
  console.info('> Server stopped')
  clean()
    .then(() => {
      process.exit(code)
    })
    .catch((err) => {
      console.error('Clean failed!')
      console.error(err)

      process.exit(1)
    })
}

process.on('exit', (code) => handleExit(code))
