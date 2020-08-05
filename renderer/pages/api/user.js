import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import getById from '../../../src/database/query/user/getById'

const user = nextConnect()

user
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
    getById(req.user.id, ['email', 'firstname', 'lastname']).then((user) => {
      res.json({ user })
    })
  })
  .put((req, res) => {
    // const { name } = req.body
    // const user = {}
    // TODO
    // const user = updateUserByUsername(req, req.user.username, { name })
    // res.json({ user })
    res.json()
  })
  .delete((req, res) => {
    // deleteUser(req)
    req.logOut()
    res.status(204).end()
  })

export default user
