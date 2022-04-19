import { IPlugin } from '@/database'
import { Pool } from 'pg'

interface ITanatloc {
  pool: Pool
  plugins: IPlugin[]
  templates: { [key: string]: ejs.TemplateFunction }
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
