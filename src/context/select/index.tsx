import { createContext, Dispatch, ReactNode, useReducer } from 'react'

/**
 * Select interface
 */
export interface ISelect {
  uuid: string
  label: number | string
}

/**
 * Select state interface
 */
export interface ISelectState {
  enabled: boolean
  type?: string
  part?: string
  highlighted?: ISelect
  selected: ISelect[]
  dispatch: Dispatch<ISelectAction>
}

/**
 * Select action interface
 */
export interface ISelectAction {
  type: string
  value?: string | ISelect
}

/**
 * Select initial state
 */
export const initialState: ISelectState = {
  enabled: false,
  type: null,
  part: null,
  highlighted: null,
  selected: [],
  dispatch: null
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
  UNSELECT: 'UNSELECT'
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
      return { ...state, enabled: false }
    case actionTypes.CLEAR:
      return { ...initialState }
    case actionTypes.SETTYPE:
      return { ...state, type: action.value as string }
    case actionTypes.SETPART:
      return { ...state, part: action.value as string }
    case actionTypes.HIGHLIGHT:
      return { ...state, highlighted: action.value as ISelect }
    case actionTypes.UNHIGHLIGHT:
      return { ...state, highlighted: null }
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
    default:
      return state
  }
}

/**
 * Enable
 */
export const enable = (): ISelectAction => {
  return { type: actionTypes.ENABLE }
}

/**
 * Disable
 */
export const disable = (): ISelectAction => {
  return { type: actionTypes.DISABLE }
}

/**
 * Clear
 */
export const clear = (): ISelectAction => {
  return { type: actionTypes.CLEAR }
}

/**
 * Set type
 * @param type Type
 */
export const setType = (type: string): ISelectAction => {
  return { type: actionTypes.SETTYPE, value: type }
}

/**
 * Set part
 * @param part Part
 */
export const setPart = (part: string): ISelectAction => {
  return { type: actionTypes.SETPART, value: part }
}

/**
 * Highlight
 * @param value { uuid, label }
 */
export const highlight = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.HIGHLIGHT,
    value: { uuid, label: label }
  }
}

/**
 * Unhighlight
 */
export const unhighlight = (): ISelectAction => {
  return { type: actionTypes.UNHIGHLIGHT }
}

/**
 * Select
 * @param value { uuid, label }
 */
export const select = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.SELECT,
    value: { uuid, label: label }
  }
}

/**
 * Unselect
 * @param value { uuid, label }
 */
export const unselect = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.UNSELECT,
    value: { uuid, label: label }
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
const SelectProvider = ({ children }) => {
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
