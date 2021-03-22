import Add from '..'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/organization', () => ({
  add: async () => mockAdd()
}))

let wrapper
describe('components/organizations/add', () => {
  const addOneOrganization = jest.fn()
  const swr = {
    addOneOrganization
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()

    wrapper = shallow(<Add swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  //   it('setVisible', () => {
  //     // wrapper.find('Button').
  //   })

  //   //   it('onAdd', () => {

  //   //   })
})
