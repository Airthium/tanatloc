/**
 * @jest-environment node
 */

import { Store } from 'redux'

import { initializeStore } from '@/store/store'

jest.mock('redux', () => ({
  createStore: jest.fn(() => ({
    id: 'store',
    getState: jest.fn()
  })),
  applyMiddleware: jest.fn(),
  combineReducers: jest.fn(() => () => 'combined')
}))

jest.mock('redux-devtools-extension', () => ({
  composeWithDevTools: jest.fn()
}))

jest.mock('redux-persist', () => ({
  persistReducer: (params) => {
    const storage = params.storage
    storage.getItem('key')
    storage.setItem('key', 'value')
    storage.removeItem('key')
  }
}))

jest.mock('redux-persist/lib/storage/createWebStorage', () => () => {})

describe('store/store (server)', () => {
  test('null window', () => {
    const res: Store & { id?: string } = initializeStore({
      select: {
        enabled: true,
        selected: []
      },
      _persist: {
        version: 1,
        rehydrated: true
      }
    })
    expect(res.id).toBe('store')
  })
})
