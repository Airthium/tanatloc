import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulationTaskFile } from '@/database/simulation/index'

import View, { errors } from '@/components/project/view'

// jest.mock('next/router', () => ({
//   useRouter: () => ({
//     push: jest.fn()
//   })
// }))

const mockErroNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErroNotification(title, err)
}))

// jest.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
//   RenderPass: class MockRenderPass {}
// }))

// jest.mock('three/examples/jsm/postprocessing/OutlinePass', () => ({
//   OutlinePass: jest.fn().mockImplementation(() => ({
//     visibleEdgeColor: {
//       set: jest.fn()
//     },
//     hiddenEdgeColor: {
//       set: jest.fn()
//     }
//   }))
// }))

// jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
//   EffectComposer: jest.fn().mockImplementation(() => ({
//     addPass: jest.fn(),
//     render: jest.fn()
//   }))
// }))

// jest.mock('three/examples/jsm/controls/TrackballControls', () => ({
//   TrackballControls: jest.fn().mockImplementation(() => ({
//     target: {
//       copy: jest.fn(),
//       clone: () => ({
//         sub: () => ({
//           normalize: () => ({
//             multiplyScalar: jest.fn()
//           })
//         })
//       })
//     },
//     update: jest.fn(),
//     object: {
//       position: {
//         distanceTo: jest.fn()
//       }
//     }
//   }))
// }))

// jest.mock('@/lib/three/helpers/AxisHelper', () => ({
//   AxisHelper: () => ({
//     render: jest.fn(),
//     resize: jest.fn(),
//     dispose: jest.fn()
//   })
// }))

// jest.mock('@/lib/three/helpers/NavigationHelper', () => ({
//   NavigationHelper: () => ({
//     render: jest.fn(),
//     resize: jest.fn(),
//     dispose: jest.fn()
//   })
// }))

// jest.mock('@/lib/three/helpers/GridHelper', () => ({
//   GridHelper: () => ({
//     update: jest.fn(),
//     setVisible: jest.fn(),
//     dispose: jest.fn()
//   })
// }))

// const mockSelectionEnabled = jest.fn()
// jest.mock('@/lib/three/helpers/SelectionHelper', () => ({
//   SelectionHelper: () => ({
//     start: jest.fn(),
//     end: jest.fn(),
//     isEnabled: () => mockSelectionEnabled(),
//     dispose: jest.fn()
//   })
// }))

// jest.mock('@/lib/three/helpers/SectionViewHelper', () => ({
//   SectionViewHelper: () => ({
//     getClippingPlane: jest.fn(),
//     start: jest.fn(),
//     toggleVisible: jest.fn(),
//     toAxis: jest.fn(),
//     flip: jest.fn(),
//     setMode: jest.fn(),
//     stop: jest.fn(),
//     dispose: jest.fn()
//   })
// }))

// jest.mock('@/lib/three/helpers/ColorbarHelper', () => ({
//   ColorbarHelper: () => ({
//     setVisible: jest.fn(),
//     setLUT: jest.fn(),
//     render: jest.fn()
//   })
// }))

// jest.mock('@/lib/three/loaders/PartLoader', () => {
//   let count = 0
//   return {
//     PartLoader: (mouseMove, mouseDown) => {
//       mouseMove(
//         {
//           highlight: jest.fn()
//         },
//         'uuid'
//       )
//       mouseDown(
//         {
//           getSelected: () => ['uuid'],
//           unselect: jest.fn()
//         },
//         'uuid'
//       )
//       mouseDown(
//         {
//           getSelected: () => ['uuid2'],
//           select: jest.fn()
//         },
//         'uuid'
//       )
//       return {
//         load: () => ({
//           children: [
//             {
//               children: [
//                 {
//                   userData: {},
//                   material: {}
//                 }
//               ]
//             },
//             {
//               children: [
//                 {
//                   userData: {
//                     lut: count++ === 1 ? null : {}
//                   },
//                   material: {}
//                 }
//               ]
//             },
//             { children: [{ userData: {}, material: {} }] }
//           ]
//         }),
//         dispose: jest.fn()
//       }
//     }
//   }
// })

// const mockAvatarAdd = jest.fn()
// jest.mock('@/api/avatar', () => ({
//   add: async () => mockAvatarAdd()
// }))

const mockGeometryGet = jest.fn()
jest.mock('@/api/geometry', () => ({
  getPart: async () => mockGeometryGet()
}))

const mockResultLoad = jest.fn()
jest.mock('@/api/result', () => ({
  load: async () => mockResultLoad()
}))

// const mockEnabled = jest.fn(() => false)
// jest.mock('react-redux', () => ({
//   useSelector: (callback) =>
//     callback({
//       select: { enabled: mockEnabled(), highlighted: {}, selected: [{}] }
//     }),
//   useDispatch: () => jest.fn()
// }))

// jest.mock('@/store/select/action', () => ({
//   highlight: jest.fn(),
//   select: jest.fn(),
//   unselect: jest.fn()
// }))

// let mockAnimationCount = 0
// Object.defineProperty(window, 'requestAnimationFrame', {
//   value: (callback: Function) => {
//     mockAnimationCount++
//     if (mockAnimationCount < 10) callback()
//   }
// })

// global.MockScene.children = [
//   { type: 'AmbientLight' },
//   {
//     type: 'PointLight',
//     position: {
//       multiplyScalar: jest.fn()
//     }
//   },
//   { type: 'AxisHelper' },
//   {
//     type: 'Part',
//     boundingBox: {
//       min: { x: 0, y: 0, z: 0 },
//       max: { x: 1, y: 1, z: 1 }
//     },
//     material: {},
//     dispose: jest.fn(),
//     setTransparent: jest.fn(),
//     startSelection: jest.fn(),
//     stopSelection: jest.fn(),
//     getSelected: () => [{}],
//     highlight: jest.fn(),
//     select: jest.fn(),
//     unselect: jest.fn()
//   },
//   {
//     visible: true,
//     type: 'Part',
//     boundingBox: {
//       min: { x: 0, y: 0, z: 0 },
//       max: { x: 1, y: 1, z: 1 }
//     },
//     material: {},
//     dispose: jest.fn(),
//     setTransparent: jest.fn(),
//     startSelection: jest.fn(),
//     stopSelection: jest.fn(),
//     getSelected: () => [{}],
//     highlight: jest.fn(),
//     select: jest.fn(),
//     unselect: jest.fn()
//   }
// ]

// // window.setTimeout = (callback) => {
// //   if (callback.name !== '_flushCallback') callback()
// // }

jest.mock('../three', () => () => <div />)

describe('components/project/view', () => {
  const project = {
    id: 'id'
  }
  const simulation = {
    id: 'id'
  }
  const geometry = {
    id: 'id'
  }
  const result = {
    glb: 'test.glb',
    originPath: 'originPath'
  } as ISimulationTaskFile

  beforeEach(() => {
    mockErroNotification.mockReset()

    mockGeometryGet.mockReset()

    mockResultLoad.mockReset()

    // mockEnabled.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<View project={project} />)

    unmount()
  })

  test('geometry cleanup', () => {
    const { unmount } = render(
      <View project={project} geometry={{ id: 'id', needCleanup: true }} />
    )

    unmount()
  })

  test('with geometry error', async () => {
    mockGeometryGet.mockImplementation(() => {
      throw new Error('geometry get error')
    })
    const { unmount } = render(<View project={project} geometry={geometry} />)

    await waitFor(() => expect(mockGeometryGet).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('geometry get error')
      )
    )

    unmount()
  })

  test('with geometry', async () => {
    const { unmount } = render(<View project={project} geometry={geometry} />)

    await waitFor(() => expect(mockGeometryGet).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with result', async () => {
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometry={geometry}
        result={result}
      />
    )

    await waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))

    unmount()
  })

  // test('window pixelRatio', () => {
  //   Object.defineProperty(window, 'devicePixelRatio', { value: null })
  //   const { unmount } = render(<View project={project} />)

  //   unmount()
  // })

  // test('resize', () => {
  //   const { unmount } = render(<View project={project} />)
  //   window.dispatchEvent(new Event('resize'))

  //   unmount()
  // })

  // test('switches & buttons', async () => {
  //   const { unmount } = render(<View project={project} geometry={geometry} />)
  //   await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))

  //   // Switches
  //   const switches = screen.getAllByRole('switch')
  //   switches.forEach((s) => fireEvent.click(s))

  //   // Buttons
  //   const buttons = screen.getAllByRole('button')
  //   buttons.forEach((button) => fireEvent.click(button))

  //   await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(1))

  //   // Avatar error
  //   mockAvatarAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   const add = screen.getByRole('button', { name: 'fund-projection-screen' })
  //   fireEvent.click(add)
  //   await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(2))
  //   await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))

  //   // Zoom
  //   const zoomIn = screen.getByRole('button', { name: 'zoom-in' })
  //   fireEvent.mouseDown(zoomIn)
  //   fireEvent.mouseUp(zoomIn)

  //   const zoomOut = screen.getByRole('button', { name: 'zoom-out' })
  //   fireEvent.mouseDown(zoomOut)
  //   fireEvent.mouseUp(zoomOut)

  //   // Section view buttons
  //   const radios = screen.getAllByRole('radio')
  //   radios.forEach((radio) => fireEvent.click(radio))

  //   const hide = screen.getByRole('button', { name: 'eye-invisible' })
  //   fireEvent.click(hide)

  //   const snapX = screen.getByRole('button', { name: 'X' })
  //   fireEvent.click(snapX)

  //   const snapY = screen.getByRole('button', { name: 'Y' })
  //   fireEvent.click(snapY)

  //   const snapZ = screen.getByRole('button', { name: 'Z' })
  //   fireEvent.click(snapZ)

  //   const flip = screen.getByRole('button', { name: 'retweet' })
  //   fireEvent.click(flip)

  //   unmount()
  // })

  // test('selection enabled', async () => {
  //   mockEnabled.mockImplementation(() => true)
  //   const { unmount } = render(<View project={project} geometry={geometry} />)

  //   await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))

  //   unmount()
  // })

  // test('sectionView', () => {
  //   const { unmount } = render(<View project={project} />)

  //   // Activate
  //   const sectionView = screen.getByRole('button', { name: 'scissor' })
  //   fireEvent.click(sectionView)

  //   const stop = screen.getByRole('button', { name: 'stop' })
  //   fireEvent.click(stop)

  //   unmount()
  // })

  // test('selectionHelper', () => {
  //   mockSelectionEnabled.mockImplementation(() => true)
  //   const { unmount } = render(<View project={project} />)

  //   const selection = screen.getByRole('button', { name: 'select' })
  //   fireEvent.click(selection)

  //   unmount()
  // })
})
