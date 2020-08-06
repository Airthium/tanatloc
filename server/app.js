import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import cors from 'cors'

import { loginRoute } from '../renderer/pages/api/login'
import logout from '../renderer/pages/api/logout'
import user from '../renderer/pages/api/user'
import workspace from '../renderer/pages/api/workspace'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:8888'
  })
)
app.use(json())
app.use(urlencoded({ extended: false }))

app.post('/api/login', async (req, res) => {
  await loginRoute(req, res)
})

app.get('/api/logout', logout)

app.get('/api/user', user)

app.get('/api/workspace', workspace)

/**
 * Catch 404 and forward to error handler
 * @param req
 * @param res
 * @param next
 */
app.use((req, res, next) => {
  next(createError(404))
})

/**
 * Error handler
 * @param req
 * @param res
 * @param next
 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send({ status: 'error', err: err })
})

export default app
