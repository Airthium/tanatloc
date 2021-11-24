/**
 * @jest-environment node
 */

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
    const res = initializeStore({})
    //@ts-ignore
    expect(res.id).toBe('store')
  })
})
