/** @module server/app */

import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import cors from 'cors'

import { loginRoute } from '../src/route/login'
import logout from '../src/route/logout'
import user from '../src/route/user'
import userCheck from '../src/route/user/check'
import workspace from '../src/route/workspace'
import project from '../src/route/project'
import projectId from '../src/route/project/[id]'
import projects from '../src/route/projects'
import projectsIds from '../src/route/projects/[ids]'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:8888', 'app://.']
  })
)
app.use(json())
app.use(urlencoded({ extended: false }))

app.post('/api/login', async (req, res) => {
  await loginRoute(req, res)
})

app.get('/api/logout', logout)

app.all('/api/user', user)
app.post('/api/user/check', userCheck)

app.all('/api/workspace', workspace)

app.all('/api/project', project)
app.all('/api/project/:id', projectId)

app.all('/api/projects', projects)
app.all('/api/projects/:ids', projectsIds)

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
