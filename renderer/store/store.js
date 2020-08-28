/** @module store */

import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import auth, { authInitialState } from './auth/reducer'

let store

const globalInitialState = {
  auth: authInitialState
}

// TODO auth is deprecated (now passport)

// COMBINE
const combinedReducers = combineReducers({
  auth
})

// REDUCERS
export const reducer = (state = globalInitialState, action) => {
  return combinedReducers(state, action)
}

// PERSIST
const persistConfig = {
  key: 'primary',
  storage
  // whitelist: ['auth'] // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(initialState = globalInitialState) {
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
  const globalStore = useMemo(() => initializeStore(initialState), [
    initialState
  ])
  return globalStore
}
