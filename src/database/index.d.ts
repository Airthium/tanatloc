/** @module Database.Interface */

export interface IDataBaseEntry {
  key: string
  value: any
  type?: 'crypt' | 'date' | 'array' | 'json'
  method?: 'append' | 'remove' | 'set' | 'erase'
  path?: string[]
}

export interface IDataBaseResponse {
  rows: any[]
}
