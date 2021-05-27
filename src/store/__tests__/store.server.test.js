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

jest.mock('redux-persist/lib/storage', () => ({}))

describe('store/store (server)', () => {
  test('null window', () => {
    const res = initializeStore()
    expect(res.id).toBe('store')
  })
})
