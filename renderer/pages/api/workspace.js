import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import getByUserId from '../../../src/database/query/workspace/getByUserId'

const workspace = nextConnect()

workspace
  .use(auth)
  .use((req, res, next) => {
    if (!req.user) {
      res
        .status(401)
        .send({ stauts: 'error', err: { message: 'unauthenticated' } })
    } else {
      next()
    }
  })
  .get((req, res) => {
    getByUserId(req.user.id).then((workspaces) => {
      res.json({ workspaces })
    })
  })
  .put((req, res) => {})
  .delete((req, res) => {})

export default workspace
