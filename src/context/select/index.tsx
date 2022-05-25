/** @module Context.Select */

import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import { IPart } from '@/lib/three/loaders/PartLoader'

/**
 * Summary interface
 */
export interface ISelectSummary {
  uuid: string
  type: string
  solids: {
    name: string
    uuid: string
    label: number
  }[]
  faces: {
    name: string
    uuid: string
    label: number
  }[]
  edges: {
    name: string
    uuid: string
    label: number
  }[]
}

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
  summary?: ISelectSummary
  highlighted?: ISelect
  selected: ISelect[]
  dispatch: Dispatch<ISelectAction>
}

/**
 * Select action interface
 */
export interface ISelectAction {
  type: string
  value?: string | ISelect | IPart
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
  UNSELECT: 'UNSELECT'
}

/**
 * Context
 */
export const SelectContext = createContext(initialState)

/**
 * Create summary
 * @param part Part
 * @returns Summary
 */
const createSummary = (part: IPart): ISelectSummary => {
  const summary: ISelectSummary = {
    uuid: part.uuid,
    type: part.name,
    solids: [],
    faces: [],
    edges: []
  }

  part.children.forEach((solid) => {
    summary.solids.push({
      name: solid.name,
      uuid: solid.userData.uuid,
      label: solid.userData.label
    })

    solid.children.forEach((child) => {
      if (child.type === 'Mesh') {
        summary.faces.push({
          name: child.name,
          uuid: child.userData.uuid,
          label: child.userData.label
        })
      } else if (child.type === 'Object3D') {
        child.children.forEach((edge) => {
          summary.edges.push({
            name: edge.name,
            uuid: edge.userData.uuid,
            label: edge.userData.label
          })
        })
      }
    })
  })

  return summary
}

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
      const summary = createSummary(action.value as IPart)
      return { ...state, part: action.value as IPart, summary: summary }
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
