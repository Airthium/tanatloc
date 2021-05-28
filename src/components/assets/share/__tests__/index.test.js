import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Share from '..'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockProjectUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockProjectUpdate()
}))

const mockWorkspaceUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockWorkspaceUpdate()
}))

describe('components/project/share', () => {
  const project = { id: 'id' }
  const workspace = { id: 'id' }
  const organizations = []
  const projectSwr = { mutateOneProject: jest.fn() }
  const workspaceSwr = { mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockError.mockReset()

    mockProjectUpdate.mockReset()

    mockWorkspaceUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    unmount()
  })

  // test('render with workspace', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Share
  //       workspace={workspace}
  //       organizations={organizations}
  //       swr={workspaceSwr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onSelectChange', () => {
  //   wrapper.find('ForwardRef(InternalTreeSelect)').props().onChange()
  // })

  // test('onShare', async () => {
  //   // Normal
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
  //   expect(projectSwr.mutateOneProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockProjectUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
  //   expect(projectSwr.mutateOneProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('onShare with workspace', async () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Share
  //       workspace={workspace}
  //       organizations={organizations}
  //       swr={workspaceSwr}
  //     />
  //   )

  //   // Normal
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)
  //   expect(workspaceSwr.mutateOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockWorkspaceUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(2)
  //   expect(workspaceSwr.mutateOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // // test('effect', () => {
  // //   // Emty organizations
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Share project={project} organizations={organizations} swr={projectSwr} />
  // //   )

  // //   // Full
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Share
  // //       project={{ ...project, groups: [{ id: 'id' }] }}
  // //       organizations={[
  // //         {
  // //           groups: [
  // //             {
  // //               id: 'id',
  // //               users: [
  // //                 {
  // //                   firstname: 'firstname'
  // //                 },
  // //                 {
  // //                   email: 'email'
  // //                 }
  // //               ]
  // //             }
  // //           ]
  // //         }
  // //       ]}
  // //       swr={projectSwr}
  // //     />
  // //   )
  // // })

  // // test('effect with workspace', () => {
  // //   // Emty organizations
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Share
  // //       workspace={workspace}
  // //       organizations={organizations}
  // //       swr={workspaceSwr}
  // //     />
  // //   )

  // //   // Full
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Share
  // //       workspace={{ ...workspace, groups: [{ id: 'id' }] }}
  // //       organizations={[
  // //         {
  // //           groups: [
  // //             {
  // //               id: 'id',
  // //               users: [
  // //                 {
  // //                   firstname: 'firstname'
  // //                 },
  // //                 {
  // //                   email: 'email'
  // //                 }
  // //               ]
  // //             }
  // //           ]
  // //         }
  // //       ]}
  // //       swr={workspaceSwr}
  // //     />
  // //   )
  // // })

  // test('propTypes', () => {
  //   let res

  //   // Project
  //   const projectProps = Share.propTypes.project
  //   res = projectProps({}, 'project', 'Share')
  //   expect(res.message).toBe(
  //     'Missing or invalid prop project supplied to Share.'
  //   )

  //   res = projectProps({ project: {} }, 'project', 'Share')
  //   expect(res.message).toBe(
  //     'Missing or invalid prop project supplied to Share.'
  //   )

  //   res = projectProps({ project: { id: 'id' } }, 'project', 'Share')
  //   expect(res).toBe()

  //   // Workspace
  //   const workspaceProps = Share.propTypes.workspace
  //   res = workspaceProps({}, 'workspace', 'Share')
  //   expect(res.message).toBe(
  //     'Missing or invalid prop workspace supplied to Share.'
  //   )

  //   res = workspaceProps({ workspace: {} }, 'workspace', 'Share')
  //   expect(res.message).toBe(
  //     'Missing or invalid prop workspace supplied to Share.'
  //   )

  //   res = workspaceProps({ workspace: { id: 'id' } }, 'workspace', 'Share')
  //   expect(res).toBe()

  //   // SWR
  //   const swrProps = Share.propTypes.swr
  //   res = swrProps({}, 'swr', 'Share')
  //   expect(res.message).toBe('Invalid prop swr supplied to Share. swr missing')

  //   res = swrProps({ project: {}, swr: {} }, 'swr', 'Share')
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Share. mutateOneProject missing or invalid'
  //   )

  //   res = swrProps(
  //     { project: {}, swr: { mutateOneProject: jest.fn() } },
  //     'swr',
  //     'Share'
  //   )
  //   expect(res).toBe()

  //   res = swrProps({ workspace: {}, swr: {} }, 'swr', 'Share')
  //   expect(res.message).toBe(
  //     'Invalid prop swr supplied to Share. mutateOneWorkspace missing or invalid'
  //   )

  //   res = swrProps(
  //     { workspace: {}, swr: { mutateOneWorkspace: jest.fn() } },
  //     'swr',
  //     'Share'
  //   )
  //   expect(res).toBe()
  // })
})
