import Dashboard from '../../../components/dashboard'
import { shallow } from 'enzyme'

import '../../../../config/jest/matchMediaMock'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

jest.mock('../../../components/project/list', () => 'list')

let mockSelector = () => ({ user: { id: 'id' } })
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn),
  useSelector: jest.fn((callback) => {
    callback({})
    return mockSelector()
  })
}))

jest.mock('../../../store/auth/action', () => ({
  logout: jest.fn()
}))

let wrapper
describe('components/dashboard', () => {
  beforeEach(() => {
    wrapper = shallow(<Dashboard />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('user', () => {
    wrapper.unmount()
    mockSelector = () => ({
      user: {}
    })
    wrapper = shallow(<Dashboard />)
    expect(mockRouter).toHaveBeenCalledTimes(1)
    mockSelector = () => ({
      user: { id: 'id' }
    })
  })

  it('collapse', () => {
    wrapper.find('Sider').props().onCollapse()
  })

  it('onSelect', () => {
    // Empty
    wrapper.find('Menu').props().onSelect({})

    // Name
    wrapper.find('Menu').props().onSelect({ key: '0' })

    // Projects
    wrapper.find('Menu').props().onSelect({ key: '1' })

    // Account
    wrapper.find('Menu').props().onSelect({ key: '2' })

    // Help
    wrapper.find('Menu').props().onSelect({ key: '3' })

    // Logout
    wrapper.find('Menu').props().onSelect({ key: '4' })
  })
})
// import { Provider } from 'react-redux'
// import configureStore from 'redux-mock-store'
// import { mount } from 'enzyme'

// jest.mock('next/router', () => {
//   return {
//     useRouter: () => ({
//       push: jest.fn()
//     })
//   }
// })
// jest.mock('../../components/project/list', () => 'list')

// let wrapper
// describe('pages/Dashbaord', () => {
//   beforeEach(() => {
//     const mockStore = configureStore()
//     const store = mockStore({
//       auth: {
//         user: {
//           id: 'id'
//         }
//       }
//     })
//     wrapper = mount(
//       <Provider store={store}>
//         <Dashboard />
//       </Provider>
//     )
//   })

//   afterEach(() => {
//     wrapper.unmount()
//   })

//   it('render', () => {
//     expect(wrapper).toBeDefined()
//   })

//   it('account', () => {
//     // console.log(wrapper.find({ label: 2 }).length)
//     // console.log(wrapper.html())
//   })
// })
