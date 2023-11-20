/** @module Pages.API.Geometry.[id].SplitStep */

import { Request, Response } from 'express'

import route from '@/route/geometry/[id]/splitStep'

/**
 * Geometry API for [id]/splitStep
 * @param req Request
 * @param res Response
 */
const splitStep = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default splitStep
