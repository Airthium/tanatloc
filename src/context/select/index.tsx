/** @module Context.Select */

import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'

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
  part?: string
  highlighted?: ISelect
  selected: ISelect[]
  point?: ISelectPoint
  data?: boolean
  postProcessing?: boolean
  dispatch: Dispatch<ISelectAction>
}

/**
 * Select action interface
 */
export interface ISelectAction {
  type: string
  value?: boolean | string | ISelectPoint | ISelect | ISelect[]
}

/**
 * Select point
 */
export interface ISelectPoint {
  x: number
  y: number
  z: number
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
  data: undefined,
  postProcessing: undefined,
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
  SELECT: 'SELECT',
  SETPOINT: 'SETPOINT',
  SETDATA: 'SETDATA',
  SETPOSTPROCESSING: 'SETPOSTPROCESSING'
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
  switch (action.type) {
    case actionTypes.ENABLE:
      return { ...state, enabled: true }
    case actionTypes.DISABLE:
      return {
        ...state,
        enabled: false,
        highlighted: undefined,
        selected: []
      }
    case actionTypes.CLEAR:
      return { ...initialState }
    case actionTypes.SETTYPE:
      return { ...state, type: action.value as 'solids' | 'faces' | 'edges' }
    case actionTypes.SETPART:
      return { ...state, part: action.value as string }
    case actionTypes.HIGHLIGHT:
      return { ...state, highlighted: action.value as ISelect | undefined }
    case actionTypes.SELECT:
      return {
        ...state,
        selected: action.value as ISelect[]
      }
    case actionTypes.SETPOINT:
      return {
        ...state,
        point: action.value as ISelectPoint
      }
    case actionTypes.SETDATA:
      return {
        ...state,
        data: action.value as boolean
      }
    case actionTypes.SETPOSTPROCESSING:
      return {
        ...state,
        postProcessing: action.value as boolean
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

  // Context
  const contextValue = useMemo(
    () => ({
      ...selectState,
      dispatch: selectDispatch
    }),
    [selectState]
  )

  /**
   * Render
   */
  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  )
}

export default SelectProvider
