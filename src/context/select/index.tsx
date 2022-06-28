/** @module Context.Select */

import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import { IPart } from '@/lib/three/loaders/PartLoader'
import { Vector3 } from 'three'

/**
 * Select interface
 */
export interface ISelect {
  uuid: string
  label: number
}

/**
 * Select state interface
 */
export interface ISelectState {
  enabled: boolean
  type?: 'solids' | 'faces' | 'edges'
  part?: IPart
  highlighted?: ISelect
  selected: ISelect[]
  point?: Vector3
  dispatch: Dispatch<ISelectAction>
}

/**
 * Select action interface
 */
export interface ISelectAction {
  type: string
  value?: string | Vector3 | ISelect | IPart
}

/**
 * Select initial state
 */
export const initialState: ISelectState = {
  enabled: false,
  type: undefined,
  part: undefined,
  highlighted: undefined,
  selected: [],
  point: undefined,
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
  CLEAR: 'CLEAR',
  SETTYPE: 'SETTYPE',
  SETPART: 'SETPART',
  HIGHLIGHT: 'HIGHLIGHT',
  UNHIGHLIGHT: 'UNHIGHLIGHT',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT',
  SETPOINT: 'SETPOINT'
}

/**
 * Context
 */
export const SelectContext = createContext(initialState)

/**
 * Reducer
 * @param state State
 * @param action Action
 * @returns State
 */
export const selectReducer = (
  state: ISelectState,
  action: ISelectAction
): ISelectState => {
  let index: number

  switch (action.type) {
    case actionTypes.ENABLE:
      return { ...state, enabled: true }
    case actionTypes.DISABLE:
      return { ...state, enabled: false, highlighted: undefined, selected: [] }
    case actionTypes.CLEAR:
      return { ...initialState }
    case actionTypes.SETTYPE:
      return { ...state, type: action.value as 'solids' | 'faces' | 'edges' }
    case actionTypes.SETPART:
      return { ...state, part: action.value as IPart }
    case actionTypes.HIGHLIGHT:
      return { ...state, highlighted: action.value as ISelect }
    case actionTypes.UNHIGHLIGHT:
      return { ...state, highlighted: undefined }
    case actionTypes.SELECT:
      index = state.selected.findIndex(
        (item: ISelect) => item.uuid === (action.value as ISelect).uuid
      )
      if (index === -1)
        return {
          ...state,
          selected: [...state.selected, action.value as ISelect]
        }
      else return state
    case actionTypes.UNSELECT:
      index = state.selected.findIndex(
        (item: ISelect) => item.uuid === (action.value as ISelect).uuid
      )
      if (index === -1) return state
      else
        return {
          ...state,
          selected: [
            ...state.selected.slice(0, index),
            ...state.selected.slice(index + 1)
          ]
        }
    case actionTypes.SETPOINT:
      return {
        ...state,
        point: action.value as Vector3
      }
    default:
      return state
  }
}

/**
 * Props
 */
export interface IProps {
  children: ReactNode
}

/**
 * Select provider
 * @param props Props
 * @returns SelectProvider
 */
const SelectProvider = ({ children }: IProps) => {
  // Reducer
  const [selectState, selectDispatch] = useReducer(selectReducer, initialState)

  /**
   * Render
   */
  return (
    <SelectContext.Provider
      value={{ ...selectState, dispatch: selectDispatch }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export default SelectProvider
