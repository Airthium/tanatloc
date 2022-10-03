/** @module Database.Interface */

export interface IDataBaseEntryBase {
  key: string
  value: string
}

export interface IDataBaseEntryCrypt extends IDataBaseEntryBase {
  type: 'crypt'
}

export interface IDataBaseEntryDate extends IDataBaseEntryBase {
  type: 'date'
}

export interface IDataBaseEntryArrayAppend extends IDataBaseEntryBase {
  type: 'array'
  method: 'append'
}

export interface IDataBaseEntryArrayRemove extends IDataBaseEntryBase {
  type: 'array'
  method: 'remove'
}

export interface IDataBaseEntryArraySet extends IDataBaseEntryBase {
  type: 'array'
  method: 'set'
  index: number
}

export type IDataBaseEntryArray =
  | IDataBaseEntryArrayAppend
  | IDataBaseEntryArrayRemove
  | IDataBaseEntryArraySet

export interface IDataBaseEntryJSONSet extends IDataBaseEntryBase {
  type: 'json'
  method: 'set'
  path: string[]
}

export interface IDataBaseEntryJSONErase extends IDataBaseEntryBase {
  type: 'json'
  method: 'erase'
  path: string[]
}

export type IDataBaseEntryJSON = IDataBaseEntryJSONSet | IDataBaseEntryJSONErase

export type IDataBaseEntry =
  | IDataBaseEntryBase
  | IDataBaseEntryCrypt
  | IDataBaseEntryDate
  | IDataBaseEntryArray[IDataBaseEntryJSON]

export interface IDataBaseResponse {
  rows: any[]
}
