/**
 * Module dependencies.
 */
import app from '../app'
import { createServer } from 'http'

/**
 * Get port from environment and store in Express.
 * @memberof Server
 */
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 * @memberof Server
 */
const server = createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 * @memberof Server
 */
function normalizePort(val: string) {
  const p = parseInt(val, 10)

  if (isNaN(p)) {
    // named pipe
    return val
  }

  if (p >= 0) {
    // port number
    return p
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 * @memberof Server
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 * @memberof Server
 */
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.debug('Listening on ' + bind)
}
