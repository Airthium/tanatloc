/** @module Context.Unit */

import { ReactNode, createContext, useMemo, useReducer } from 'react'

export type TSystem = 'SI' | 'mSI'

/**
 * Unit state interface
 */
export interface IUnitState {
  system?: TSystem
}

/**
 * Unit action interface
 */
export interface IUnitAction {
  type: string
  value: TSystem | undefined
}

/**
 * Unit initial state
 */
export const initialState: IUnitState = {
  system: 'SI'
}

/**
 * Action types
 */
export const actionTypes = {
  SET: 'SET'
}

/**
 * Context
 */
export const UnitContext = createContext(initialState)

/**
 * Reducer
 * @param state State
 * @param action Action
 * @returns State
 */
export const unitReducer = (
  state: IUnitState,
  action: IUnitAction
): IUnitState => {
  if (action.type === actionTypes.SET) return { ...state, system: action.value }

  return state
}

/**
 * Props
 */
export interface IProps {
  children: ReactNode
}

/**
 * Unit provider
 * @param props Props
 * @returns UnitProvider
 */
const UnitProvider = ({ children }: IProps): React.JSX.Element => {
  // Reducer
  const [unitState, unitDispatch] = useReducer(unitReducer, initialState)

  // Context
  const contextValue = useMemo(
    () => ({
      ...unitState,
      dispatch: unitDispatch
    }),
    [unitState]
  )

  /**
   * Render
   */
  return (
    <UnitContext.Provider value={contextValue}>{children}</UnitContext.Provider>
  )
}

export default UnitProvider
