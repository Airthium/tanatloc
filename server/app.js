import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import cors from 'cors'

import login from '../renderer/pages/api/login'
import logout from '../renderer/pages/api/logout'
import user from '../renderer/pages/api/user'
import workspace from '../renderer/pages/api/workspace'

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.post('/api/login', (req, res) => {
  login(req, res)
})

app.get('/api/logout', (req, res) => {
  logout(req, res)
})

app.get('/api/user', (req, res) => {
  user(req, res)
})

app.get('/api/workspace', (req, res) => {
  workspace(req, res)
})

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
