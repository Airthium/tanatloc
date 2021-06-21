/** @module store */

import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import select, { selectInitialState } from './select/reducer'

let store

const globalInitialState = {
  select: selectInitialState
}

/**
 * Combine reducers
 */
const combinedReducers = combineReducers({
  select
})

/**
 * Global reducer
 * @param {Object} state Redux state
 * @param {Object} action Redux action
 */
export const reducer = (state = globalInitialState, action = {}) => {
  return combinedReducers(state, action)
}

// PERSIST
const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null)
  },
  setItem(_key, value) {
    return Promise.resolve(value)
  },
  removeItem(_key) {
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

const makeStore = (initialState = globalInitialState) => {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = (preloadedState) => {
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

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
