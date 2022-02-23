import { Request, Response } from 'express'

const noop = async (req: Request, res: Response): Promise<void> => {
  res.status(200).end()
}

export default noop
