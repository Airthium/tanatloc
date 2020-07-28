import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'

import login from '../renderer/pages/api/user/login'

var app = express()

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/user/login', login)

export default app
