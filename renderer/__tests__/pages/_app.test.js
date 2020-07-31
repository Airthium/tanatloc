import App from '../../pages/_app'
import { shallow } from 'enzyme'

jest.mock('../../store/store', () => ({
  useStore: jest.fn()
}))

jest.mock('react-redux', () => ({
  Provider: 'provider'
}))

jest.mock('redux-persist', () => ({
  persistStore: jest.fn()
}))

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: 'persistGate'
}))

jest.mock('../../styles/antd.less', () => '')
jest.mock('../../styles/global.less', () => '')

let wrapper
describe('pages/_app', () => {
  beforeEach(() => {
    wrapper = shallow(<App Component="component" pageProps={{}} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
