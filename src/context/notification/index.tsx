/** @module Context.Notification */

import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react'
import { App } from 'antd'

import { ICallError } from '@/api/index.d'

import {
  ErrorNotification,
  SuccessNotification
} from '@/components/assets/notification'

export interface ISuccessItem {
  title: string
  description?: string
}

export interface IErrorItem {
  title: string
  err?: ICallError
  display?: false
}

export interface INotificationState {
  success?: ISuccessItem[]
  errors?: IErrorItem[]
  dispatch: Dispatch<INotificationAction>
}

export interface INotificationAction {
  type: string
  value: ISuccessItem | IErrorItem
}

/**
 * Initial state
 */
export const initialState: INotificationState = {
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  ADDSUCCESS: 'ADDSUCCESS',
  REMOVESUCCESS: 'REMOVESUCCESS',
  ADDERROR: 'ADDERROR',
  REMOVEERROR: 'REMOVEERROR'
}

/**
 * Context
 */
export const NotificationContext = createContext(initialState)

/**
 * Reducer
 * @param state State
 * @param action Action
 * @returns State
 */
export const notificationReducer = (
  state: INotificationState,
  action: INotificationAction
): INotificationState => {
  let index: number

  switch (action.type) {
    case actionTypes.ADDSUCCESS:
      return { ...state, success: [...(state.success ?? []), action.value] }
    case actionTypes.REMOVESUCCESS:
      index =
        state.success?.findIndex((success) => success === action.value) ?? -1
      if (index !== -1)
        return {
          ...state,
          success: [
            ...state.success!.slice(0, index),
            ...state.success!.slice(index + 1)
          ]
        }
      return state
    case actionTypes.ADDERROR:
      return { ...state, errors: [...(state.errors ?? []), action.value] }
    case actionTypes.REMOVEERROR:
      index = state.errors?.findIndex((error) => error === action.value) ?? -1
      if (index !== -1)
        return {
          ...state,
          errors: [
            ...state.errors!.slice(0, index),
            ...state.errors!.slice(index + 1)
          ]
        }
      return state
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
 * NotificationProvider
 * @param props Props
 * @returns NotificationProvider
 */
const NotificationProvider = ({ children }: IProps) => {
  // Reducer
  const [notificationState, notificationDispatch] = useReducer(
    notificationReducer,
    initialState
  )

  // Value
  const contextValue = useMemo(
    () => ({
      ...notificationState,
      dispatch: notificationDispatch
    }),
    [notificationState]
  )

  /**
   * Render
   */
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <App>
        <SuccessNotification />
        <ErrorNotification />
      </App>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
