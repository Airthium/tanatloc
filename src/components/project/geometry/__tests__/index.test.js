import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Geometry from '@/components/project/simulation/geometry'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => 'DeleteDialog'
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockGet = jest.fn()
jest.mock('@/api/file', () => ({
  get: async () => mockGet()
}))

global.FileReader = class {
  constructor() {
    this.result = 'result'
  }
  addEventListener(_, callback) {
    callback()
  }
  readAsArrayBuffer() {}
}

describe('components/project/simulation/geometry', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        geometry: {}
      }
    }
  }
  const part = null
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    mockGet.mockReset()

    mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Geometry simulation={simulation} part={part} swr={swr} />
    )

    unmount()
  })

  // test('beforeUpload', () => {
  //   let res

  //   // Wrong
  //   res = wrapper.find('Upload').props().beforeUpload({
  //     name: 'test.test'
  //   })
  //   expect(res).toBe(false)

  //   // Good
  //   res = wrapper.find('Upload').props().beforeUpload({
  //     name: 'test.dxf'
  //   })
  //   expect(res).toBe(true)
  // })

  // test('onUpload', async () => {
  //   // Uploading
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'uploading'
  //       }
  //     })

  //   // Normal
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'done'
  //       }
  //     })
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'done'
  //       }
  //     })
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Geometry simulation={simulation} part={part} swr={swr} />)
  // //   expect(wrapper).toBeDefined()

  // //   // With file
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={part}
  // //       swr={swr}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()
  // // })

  // // test('setDeleteVisible', () => {
  // //   // Need file
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={part}
  // //       swr={swr}
  // //     />
  // //   )

  // //   // Open
  // //   act(() => wrapper.find('Button').at(1).props().onClick())

  // //   // Close
  // //   act(() => wrapper.find('DeleteDialog').props().onCancel())
  // // })

  // // test('onDelete', async () => {
  // //   // Need file
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={part}
  // //       swr={swr}
  // //     />
  // //   )

  // //   // Normal
  // //   await act(async () => await wrapper.find('DeleteDialog').props().onOk())
  // //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  // //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  // //   expect(mockError).toHaveBeenCalledTimes(0)

  // //   // Error
  // //   mockUpdate.mockImplementation(() => {
  // //     throw new Error()
  // //   })
  // //   await act(async () => await wrapper.find('DeleteDialog').props().onOk())
  // //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  // //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  // //   expect(mockError).toHaveBeenCalledTimes(1)
  // // })

  // // test('onDownload', async () => {
  // //   // Need file
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={part}
  // //       swr={swr}
  // //     />
  // //   )

  // //   // Normal
  // //   mockGet.mockImplementation(() => ({
  // //     buffer: ['buffer']
  // //   }))
  // //   window.URL.createObjectURL = () => 'url'
  // //   await act(async () => await wrapper.find('Button').at(0).props().onClick())
  // //   expect(mockGet).toHaveBeenCalledTimes(1)
  // //   expect(mockError).toHaveBeenCalledTimes(0)

  // //   // Error
  // //   mockGet.mockImplementation(() => {
  // //     throw new Error()
  // //   })
  // //   await act(async () => await wrapper.find('Button').at(0).props().onClick())
  // //   expect(mockGet).toHaveBeenCalledTimes(2)
  // //   expect(mockError).toHaveBeenCalledTimes(1)
  // // })

  // // test('with part', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={{}}
  // //       swr={swr}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()

  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={{
  // //         solids: [{}],
  // //         faces: [{}],
  // //         edges: [{}]
  // //       }}
  // //       swr={swr}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()

  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={{
  // //         solids: [{}],
  // //         faces: [{}],
  // //         edges: [{}]
  // //       }}
  // //       swr={swr}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()

  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Geometry
  // //       simulation={{
  // //         ...simulation,
  // //         scheme: {
  // //           ...simulation.scheme,
  // //           configuration: {
  // //             ...simulation.scheme.configuration,
  // //             geometry: {
  // //               file: {
  // //                 glb: 'glb',
  // //                 originPath: 'originPath'
  // //               }
  // //             }
  // //           }
  // //         }
  // //       }}
  // //       part={{
  // //         error: true,
  // //         message: 'Error'
  // //       }}
  // //       swr={swr}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()
  // // })
})
