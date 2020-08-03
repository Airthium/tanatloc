import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'
import passport from '../../../src/auth/passport'

const login = nextConnect()

login.use(auth).post(passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user })
})

export default login
