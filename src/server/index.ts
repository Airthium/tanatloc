/** @module Server */

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

import init from './init'
import clean from './clean'

const port = parseInt(process.env.PORT ?? '3000', 10)
const hostname = 'localhost'
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Initialize
Object.defineProperty(global, 'tanatloc', {
  value: {},
  configurable: true
})
init()
  .then(() => {
    // Server
    app
      .prepare()
      .then(() => {
        createServer((req, res) => {
          try {
            const parsedUrl = parse(req.url!, true)
            handle(req, res, parsedUrl).catch(console.error)
          } catch (err) {
            console.error(err)
            res.statusCode = 500
            res.end('Internal server error')
          }
        }).listen(port)

        console.info(
          `> Server listening at http://localhost:${port} as ${
            dev ? 'development' : process.env.NODE_ENV
          }`
        )
      })
      .catch(console.error)
  })
  .catch((err) => {
    console.error('Initialize failed!')
    console.error(err)

    process.exit(1)
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
