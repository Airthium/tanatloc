/** @module Route.Result.Download */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import ResultLib from '@/lib/result'

export interface IDownloadBody {
  simulation: {
    id: string
  }
  result: {
    originPath: string
    fileName: string
  }
}

/**
 * Check download body
 * @param body Body
 */
const checkDownloadBody = (body: IDownloadBody): void => {
  if (
    !body?.simulation?.id ||
    typeof body.simulation.id !== 'string' ||
    !body.result?.originPath ||
    typeof body.result.originPath !== 'string' ||
    !body.result.fileName ||
    typeof body.result.fileName !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), fileName(string) } }'
    )
}

/**
 * Result download API
 * @param req Request
 * @param res Response
 */
const download = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      //Check
      checkDownloadBody(req.body)

      const { simulation, result } = req.body

      // Check auth
      await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

      //Download
      try {
        const fileStream = ResultLib.download(simulation, result)
        fileStream.pipe(res)
      } catch (err: any) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default download
