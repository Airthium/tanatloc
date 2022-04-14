import { IPlugin } from '@/database'
import { Pool } from 'pg'

interface ITanatloc {
  pool?: Pool
  plugins?: IPlugin[]
  templates?: { [key: string]: (parameters: object) => Promise<string> }
}

declare global {
  var tanatloc: ITanatloc | undefined
}
