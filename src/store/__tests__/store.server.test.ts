/**
 * @jest-environment node
 */

import '../store'

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
  test('null window', () => {})
})
