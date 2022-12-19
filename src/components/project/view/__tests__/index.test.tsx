import { render, waitFor } from '@testing-library/react'

import { ISimulationTaskFile } from '@/database/simulation/index'

import View, { errors } from '@/components/project/view'

const mockErroNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErroNotification(title, err)
}))

const mockGeometryGet = jest.fn()
jest.mock('@/api/geometry', () => ({
  getPart: async () => mockGeometryGet()
}))

const mockResultLoad = jest.fn()
jest.mock('@/api/result', () => ({
  load: async () => mockResultLoad()
}))

jest.mock('../three', () => () => <div />)

describe('components/project/view', () => {
  const project = {
    id: 'id',
    title: 'title'
  }
  const simulation = {
    id: 'id'
  }
  const geometries = [
    {
      id: 'id'
    }
  ]
  const result = {
    glb: 'test.glb',
    originPath: 'originPath',
    json: 'json'
  } as ISimulationTaskFile

  const postprocessing = {
    glb: 'test.glb',
    originPath: 'originPath',
    json: 'json'
  } as ISimulationTaskFile

  beforeEach(() => {
    mockErroNotification.mockReset()

    mockGeometryGet.mockReset()

    mockResultLoad.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<View project={project} geometries={[]} />)

    unmount()
  })

  test('with simulation', () => {
    const { unmount } = render(
      <View simulation={simulation} project={project} geometries={[]} />
    )

    unmount()
  })

  test('geometry cleanup', () => {
    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        geometries={[{ id: 'id0', needCleanup: true }]}
      />
    )

    unmount()
  })

  test('with geometry error', () => {
    mockGeometryGet.mockImplementation(() => {
      throw new Error('geometry get error')
    })
    const { unmount } = render(
      <View simulation={simulation} project={project} geometries={geometries} />
    )

    waitFor(() => expect(mockGeometryGet).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('geometry get error')
      )
    )

    unmount()
  })

  test('with geometry', () => {
    const { unmount } = render(
      <View simulation={simulation} project={project} geometries={geometries} />
    )

    waitFor(() => expect(mockGeometryGet).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with result error', () => {
    mockResultLoad.mockImplementation(() => {
      throw new Error('result load error')
    })
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        result={result}
      />
    )

    waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('result load error')
      )
    )

    unmount()
  })

  test('with result', () => {
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        result={result}
      />
    )

    waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with postprocessing error', () => {
    mockResultLoad.mockImplementation(() => {
      throw new Error('postprocessing load error')
    })
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        result={result}
        postprocessing={postprocessing}
      />
    )

    waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('postprocessing load error')
      )
    )

    unmount()
  })

  test('with postprocessing', () => {
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        result={result}
        postprocessing={postprocessing}
      />
    )

    waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))

    unmount()
  })
})
