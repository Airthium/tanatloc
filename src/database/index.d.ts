/** @module Database.Interface */

export interface IDataBaseEntry {
  key: string
  value: any
  type?: string
  method?: string
  path?: Array<string>
}

export interface IDataBaseResponse {
  rows: Array<any>
}
