import Dashboard from '../../pages/dashboard'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme'

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      push: jest.fn()
    })
  }
})
jest.mock('../../components/project/list', () => 'list')

let wrapper
describe('pages/dashbaord', () => {
  beforeEach(() => {
    const mockStore = configureStore()
    const store = mockStore({
      auth: {
        user: {
          id: 'id'
        }
      }
    })
    wrapper = mount(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('account', () => {
    // console.log(wrapper.find({ label: 2 }).length)
    // console.log(wrapper.html())
  })
})
