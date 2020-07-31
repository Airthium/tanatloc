import { useStore, reducer, initializeStore } from '../../store/store'

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

jest.mock('redux-persist/lib/storage', () => ({}))

describe('store/store', () => {
  it('reducer', () => {
    const res = reducer()
    expect(res).toBe('combined')
  })

  it('initializeStore', () => {
    let res

    res = initializeStore()
    expect(res.id).toBe('store')

    res = initializeStore({})
    expect(res.id).toBe('store')
  })

  it('useStore', () => {
    const res = useStore()
    expect(res).toBe('memo')
  })
})
