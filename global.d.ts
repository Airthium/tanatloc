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
  let electron

  interface Window {
    MathJax?: {
      typesetPromise: (element?: HTMLDivElement[]) => Promise<void>
    }
  }
}

global.tanatloc = global.tanatloc ?? {}
global.electron = global.electron ?? {
  fullBuild: false
}
