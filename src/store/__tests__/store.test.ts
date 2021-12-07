import { useStore, reducer, initializeStore } from '@/store/store'

jest.mock('react', () => ({
  useMemo: jest.fn((callback) => {
    callback()
    return 'memo'
  })
}))

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
  persistReducer: jest.fn()
}))

jest.mock('redux-persist/lib/storage/createWebStorage', () => () => {})

describe('store/store', () => {
  test('reducer', () => {
    const res = reducer()
    expect(res).toBe('combined')
  })

  test('initializeStore', () => {
    let res

    res = initializeStore()
    expect(res.id).toBe('store')

    res = initializeStore({
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

    res = initializeStore({
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

  test('useStore', () => {
    const res = useStore({
      select: {
        enabled: true,
        selected: []
      },
      _persist: {
        version: 1,
        rehydrated: true
      }
    })
    expect(res).toBe('memo')
  })
})