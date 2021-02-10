/** @module server/app */

import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import cors from 'cors'

import { loginRoute } from '@/route/login'
import logout from '@/route/logout'
import user from '@/route/user'
import userCheck from '@/route/user/check'
import avatar from '@/route/avatar'
import workspace from '@/route/workspace'
import project from '@/route/project'
import projectId from '@/route/project/[id]'
import projects from '@/route/projects'
import projectsIds from '@/route/projects/[ids]'
import simulation from '@/route/simulation'
import simulationId from '@/route/simulation/[id]'
import simulationIdRun from '@/route/simulation/[id]/run'
import simulations from '@/route/simulations'
import simulationsIds from '@/route/simulations/[ids]'
import part from '@/route/part'
import file from '@/route/file'
import plugin from '@/route/plugin'

const app = express()
app.disable('x-powered-by')

app.use(
  cors({
    origin: ['http://localhost:8888', 'app://.']
  })
)
app.use(json({ limit: '150mb' }))
app.use(urlencoded({ extended: false, limit: '150mb' }))

app.post('/api/login', async (req, res) => {
  await loginRoute(req, res)
})

app.get('/api/logout', logout)

app.all('/api/user', user)
app.post('/api/user/check', userCheck)

app.all('/api/avatar', avatar)

app.all('/api/workspace', workspace)

app.all('/api/project', project)
app.all('/api/project/:id', projectId)

app.all('/api/projects', projects)
app.all('/api/projects/:ids', projectsIds)

app.all('/api/simulation', simulation)
app.all('/api/simulation/:id', simulationId)
app.all('/api/simulation/:id/run', simulationIdRun)

app.all('/api/simulations', simulations)
app.all('/api/simulations/:ids', simulationsIds)

app.all('/api/part', part)

app.all('/api/file', file)

app.all('/api/plugin', plugin)

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
