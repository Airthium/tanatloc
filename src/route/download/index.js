import getSessionId from '../session'
import auth from '../auth'

import DownloadLib from '@/lib/download'
import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get file
    try {
      const { simulation, file, archive } = req.body

      // Check authorization
      const simulationAuth = await SimulationLib.get(simulation.id, ['project'])
      const projectAuth = await ProjectLib.get(simulationAuth.project, [
        'owners',
        'users',
        'groups',
        'workspace'
      ])
      const workspaceAuth = await WorkspaceLib.get(projectAuth.workspace, [
        'owners',
        'users',
        'groups'
      ])
      if (!(await auth(sessionId, projectAuth, workspaceAuth))) {
        res.status(401).json({ error: true, message: 'Unauthorized' })
        return
      }

      if (archive) {
        res.setHeader('Content-type', 'application/zip')
        const archiveStream = await DownloadLib.createArchiveStream(simulation)
        archiveStream.pipe(res)
      } else {
        const fileStream = DownloadLib.createReadStream(simulation, file)
        fileStream.pipe(res)
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
