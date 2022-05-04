import { IPlugin } from '@/database'
import { Pool } from 'pg'
import { AsyncTemplateFunction } from 'ejs'

interface ITanatloc {
  pool: Pool
  plugins: IPlugin[]
  templates: { [key: string]: AsyncTemplateFunction }
  complete: boolean
}

declare global {
  let tanatloc: ITanatloc

  interface Window {
    MathJax?: {
      typesetPromise: () => Promise<void>
    }
  }
}

global.tanatloc = global.tanatloc || {}
