/** @namespace Store */

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

let store: Store<{
  select: SelectState
}>

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
 * @param {Object} state Redux state
 * @param {Object} action Redux action
 */
const reducer = (
  state: { select: SelectState } = globalInitialState,
  action?: AnyAction
) => {
  return combinedReducers(state, action)
}

// PERSIST
const createNoopStorage = () => ({
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
  // whitelist: ['select'] // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

/**
 * Make store
 * @memberof Store
 * @param {Object} initialState Initial store
 */
const makeStore = (initialState: {
  select: SelectState
  _persist: { version: number; rehydrated: boolean }
}) => {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}

/**
 * Initialize store
 * @memberof Store
 * @param {Object} preloadedState Preloaded store
 */
const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

/**
 * Use store
 * @memberof Store
 * @param {Object} initialState Initial store
 */
const useStore = (initialState) => {
  return useMemo(() => initializeStore(initialState), [initialState])
}

export { reducer, initializeStore, useStore }
