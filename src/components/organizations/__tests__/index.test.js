import Organizations from '..'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../list', () => {
  const List = () => <div />
  return List
})

jest.mock('@/components/assets/organization', () => {
  const Organization = () => <div />
  return Organization
})

let wrapper
describe('components/organizations', () => {
  const user = { id: 'id' }
  const organizations = []

  const reloadOrganizations = jest.fn()
  const addOneOrganization = jest.fn()
  const delOneOrganization = jest.fn()
  const mutateOneOrganization = jest.fn()
  const loadingOrganizations = false
  const swr = {
    reloadOrganizations,
    addOneOrganization,
    delOneOrganization,
    mutateOneOrganization,
    loadingOrganizations
  }

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    wrapper = shallow(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )
    expect(wrapper).toBeDefined()
  })

  // test('setOrganization', () => {
  //   wrapper = mount(
  //     <Organizations
  //       user={user}
  //       organizations={[...organizations, { id: 'id' }]}
  //       swr={swr}
  //     />
  //   )

  //   act(() => wrapper.find('List').props().setOrganization({ id: 'id' }))
  //   wrapper.update()

  //   act(() => wrapper.find('Organization').props().onClose())
  //   wrapper.update()
  // })

  // test('effect', () => {
  //   wrapper = mount(
  //     <Organizations
  //       user={user}
  //       organizations={[...organizations, { id: 'id', diff: 'diff' }]}
  //       swr={swr}
  //     />
  //   )

  //   act(() => wrapper.find('List').props().setOrganization({ id: 'id' }))
  //   wrapper.update()
  // })
})
