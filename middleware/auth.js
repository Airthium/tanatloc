import nextConnect from 'next-connect'
import passport from '../src/auth/passport'
import session from '../src/auth/session'

const auth = nextConnect()
  .use(
    session({
      name: 'sess',
      secret: process.env.PASSPORT_SECRET,
      cookie: {
        maxAge: 60 * 60 * 8, // 8 hours,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
      }
    })
  )
  .use((req, res, next) => {
    // Initialize mocked database
    // Remove this after you add your own database
    req.session.users = req.session.users || []
    next()
  })
  .use(passport.initialize())
  .use(passport.session())

export default auth
