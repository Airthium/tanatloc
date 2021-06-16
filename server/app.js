/** @module server/app */

import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import cors from 'cors'

import avatar from '@/route/avatar'
import geometries from '@/route/geometries'
import geometry from '@/route/geometry'
import geometryId from '@/route/geometry/[id]'
import geometryDownload from '@/route/geometry/[id]/download'
import geometryPart from '@/route/geometry/[id]/part'
import group from '@/route/group'
import groups from '@/route/groups'
import groupsId from '@/route/groups/[id]'
import organization from '@/route/organization'
import organizations from '@/route/organizations'
import plugin from '@/route/plugin'
import project from '@/route/project'
import projectId from '@/route/project/[id]'
import projects from '@/route/projects'
import result from '@/route/result'
import resultDownload from '@/route/result/download'
import resultArchive from '@/route/result/archive'
import simulation from '@/route/simulation'
import simulationId from '@/route/simulation/[id]'
import simulationIdRun from '@/route/simulation/[id]/run'
import simulations from '@/route/simulations'
import system from '@/route/system'
import user from '@/route/user'
import userCheck from '@/route/user/check'
import users from '@/route/users'
import workspace from '@/route/workspace'
import { loginRoute } from '@/route/login'
import logout from '@/route/logout'

const app = express()
app.disable('x-powered-by')

app.use(
  cors({
    origin: ['http://localhost:8888', 'app://.']
  })
)
app.use(json({ limit: '150mb' }))
app.use(urlencoded({ extended: false, limit: '150mb' }))

app.all('/api/avatar', avatar)

app.all('/api/geometries', geometries)

app.all('/api/geometry', geometry)
app.all('/api/geometry/:id', geometryId)
app.all('/api/geometry/:id/download', geometryDownload)
app.all('/api/geometry/:id/part', geometryPart)

app.all('/api/group', group)

app.all('/api/groups', groups)
app.all('/api/group/:id', groupsId)

app.all('/api/organization', organization)
app.all('/api/organizations', organizations)

app.all('/api/plugin', plugin)

app.all('/api/project', project)
app.all('/api/project/:id', projectId)

app.all('/api/projects', projects)

app.all('/api/result', result)
app.all('/api/result/download', resultDownload)
app.all('/api/result/archive', resultArchive)

app.all('/api/simulation', simulation)
app.all('/api/simulation/:id', simulationId)
app.all('/api/simulation/:id/run', simulationIdRun)

app.all('/api/simulations', simulations)

app.all('/api/system', system)

app.all('/api/user', user)
app.post('/api/user/check', userCheck)

app.all('/api/users', users)

app.all('/api/workspace', workspace)

app.post('/api/login', async (req, res) => {
  await loginRoute(req, res)
})

app.get('/api/logout', logout)

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
