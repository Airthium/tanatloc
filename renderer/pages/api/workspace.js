import { getSession } from '../../../src/auth/iron'
import getByUserId from '../../../src/database/query/workspace/getByUserId'
import add from '../../../src/database/query/workspace/add'
import update from '../../../src/database/query/workspace/update'
import del from '../../../src/database/query/workspace/delete'

export default async function (req, res) {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'GET':
      getByUserId(session.id).then((workspaces) => {
        res.status(200).json({ workspaces })
      })
      break
    case 'POST':
      add(session.id, req.body)
        .then((workspace) => res.status(200).json({ workspace }))
        .catch((err) => {
          console.error(err)
          res.status(500).json({ message: err.message })
        })
      break
    case 'PUT':
      update(req.body)
        .then(() => res.status(200).end())
        .catch((err) => {
          console.error(err)
          res.status(204).jsoon({ message: err.messagee })
        })
      break
    case 'DELETE':
      del(session.id, req.body)
        .then(() => res.status(200).end())
        .catch((err) => {
          console.error(err)
          res.status(500).json({ message: err.message })
        })
      break
    default:
      res.status(405).json({ message: 'Method ' + req.method + ' not allowed' })
  }
}
