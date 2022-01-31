/** @module Store */

import { useMemo } from 'react'
import {
  AnyAction,
  Store,
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import select, { selectInitialState, SelectState } from './select/reducer'

/**
 * Global initial store
 * @memberof Store
 */
const globalInitialState = {
  select: selectInitialState
}

/**
 * Combine reducers
 * @memberof Store
 */
const combinedReducers = combineReducers({
  select
})

/**
 * Global reducer
 * @memberof Store
 * @param state Redux state
 * @param action Redux action
 */
const reducer = (
  state: { select: SelectState } = globalInitialState,
  action?: AnyAction
) => {
  return combinedReducers(state, action)
}

// PERSIST
const createNoopStorage = (): any => ({
  getItem(_key: string) {
    return Promise.resolve(null)
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value)
  },
  removeItem(_key: string) {
    return Promise.resolve()
  }
})

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const persistConfig = {
  key: 'primary',
  storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

/**
 * Make store
 * @memberof Store
 * @param initialState Initial store
 */
const makeStore = (initialState: {
  select: SelectState
  _persist: { version: number; rehydrated: boolean }
}): Store => {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}

/**
 * Use store
 * @memberof Store
 * @param initialState Initial store
 */
const useStore = (initialState: {
  select: SelectState
  _persist: { version: number; rehydrated: boolean }
}) => {
  return useMemo(() => makeStore(initialState), [initialState])
}

export { reducer, useStore }
