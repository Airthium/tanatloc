import Organizations from '..'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import '@/config/jest/mockMatchMedia'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../list', () => {
  const List = () => <div />
  return List
})

jest.mock('../organization', () => {
  const Organization = () => <div />
  return Organization
})

let wrapper
describe('components/organizations', () => {
  const user = {}
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

  it('render', () => {
    wrapper = shallow(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )
    expect(wrapper).toBeDefined()
  })

  it('setOrganization', () => {
    wrapper = mount(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )

    act(() => wrapper.find('List').props().setOrganization({}))
    wrapper.update()

    act(() => wrapper.find('Organization').props().onClose())
    wrapper.update()
  })

  it('effect', () => {
    wrapper = mount(
      <Organizations
        user={user}
        organizations={[...organizations, { id: 'id', diff: 'diff' }]}
        swr={swr}
      />
    )

    act(() => wrapper.find('List').props().setOrganization({ id: 'id' }))
    wrapper.update()
  })
})
