import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Group from '..'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/group', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

let wrapper
describe('components/assets/groups', () => {
  const userOptions = []
  const organization = {
    id: 'id'
  }
  const group = {
    id: 'id',
    name: 'name',
    users: [{ id: 'id' }]
  }
  const swr = {
    reloadOrganizations: jest.fn(),
    addOneGroup: jest.fn(),
    mutateOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    swr.reloadOrganizations.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Group userOptions={userOptions} organization={organization} swr={swr} />
    )

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onAdd', async () => {
  //   // Normal
  //   mockAdd.mockImplementation(() => ({}))
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(swr.addOneGroup).toHaveBeenCalledTimes(1)
  //   expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(swr.addOneGroup).toHaveBeenCalledTimes(1)
  //   expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('edit', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Group
  //       userOptions={userOptions}
  //       organization={organization}
  //       group={group}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })

  // test('onUpdate', async () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Group
  //       userOptions={userOptions}
  //       organization={organization}
  //       group={group}
  //       swr={swr}
  //     />
  //   )

  //   // Normal
  //   await wrapper
  //     .find('Dialog')
  //     .props()
  //     .onOk({
  //       name: 'otherName',
  //       users: ['id', 'id1']
  //     })
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(swr.mutateOneGroup).toHaveBeenCalledTimes(1)
  //   expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper
  //     .find('Dialog')
  //     .props()
  //     .onOk({ name: 'name', users: ['id'] })
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(swr.mutateOneGroup).toHaveBeenCalledTimes(1)
  //   expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('propTypes', () => {
  //   let res
  //   const swrProp = Group.propTypes.swr

  //   res = swrProp({}, 'swr', 'Group')
  //   expect(res.message).toBe('Invalid prop swr supplied to Group. swr missing')

  //   res = swrProp({ swr: {} }, 'swr', 'Group')
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. addOneGroup missing or invalid'
  //   )

  //   res = swrProp({ swr: { addOneGroup: {} } }, 'swr', 'Group')
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. addOneGroup missing or invalid'
  //   )

  //   res = swrProp({ swr: { addOneGroup: jest.fn } }, 'swr', 'Group')
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. reloadOrganizations missing or invalid'
  //   )

  //   res = swrProp(
  //     { swr: { reloadOrganizations: {}, addOneGroup: jest.fn } },
  //     'swr',
  //     'Group'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. reloadOrganizations missing or invalid'
  //   )

  //   res = swrProp(
  //     { swr: { reloadOrganizations: jest.fn, addOneGroup: jest.fn } },
  //     'swr',
  //     'Group'
  //   )
  //   expect(res).toBe()

  //   res = swrProp(
  //     { swr: { reloadOrganizations: jest.fn }, group: {} },
  //     'swr',
  //     'Group'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. mutateOneGroup missing or invalid'
  //   )

  //   res = swrProp(
  //     { swr: { reloadOrganizations: jest.fn, mutateOneGroup: {} }, group: {} },
  //     'swr',
  //     'Group'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Group. mutateOneGroup missing or invalid'
  //   )

  //   res = swrProp(
  //     {
  //       swr: { reloadOrganizations: jest.fn, mutateOneGroup: jest.fn },
  //       group: {}
  //     },
  //     'swr',
  //     'Group'
  //   )
  //   expect(res).toBe()
  // })
})
