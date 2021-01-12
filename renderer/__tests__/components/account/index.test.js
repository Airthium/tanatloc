import Account from '../../../components/account'
import { shallow } from 'enzyme'

jest.mock('../../../components/account/information', () => 'information')
jest.mock('../../../components/account/password', () => 'password')
jest.mock('../../../components/account/delete', () => 'delete')
jest.mock('../../../components/account/hpc', () => 'hpc')

let wrapper
describe('renderer/components/account', () => {
  beforeEach(() => {
    wrapper = shallow(<Account />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
