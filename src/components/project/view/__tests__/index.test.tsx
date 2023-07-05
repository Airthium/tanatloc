import { render, screen, waitFor } from '@testing-library/react'

import { ISimulationTaskFile } from '@/database/simulation/index'

import View, { errors } from '@/components/project/view'

const mockErroNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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

jest.mock('../three', () => (props: any) => (
  <div>{JSON.stringify(props.parts)}</div>
))

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
  const results = [
    {
      glb: 'test.glb',
      originPath: 'originPath',
      json: 'json'
    } as ISimulationTaskFile
  ]

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
    const { unmount } = render(
      <View project={project} results={[]} geometries={[]} />
    )

    unmount()
  })

  test('with simulation', () => {
    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    unmount()
  })

  test('geometry cleanup', () => {
    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[{ id: 'id0', needCleanup: true }]}
      />
    )

    unmount()
  })

  test('with geometry error', async () => {
    mockGeometryGet.mockImplementation(() => {
      throw new Error('geometry get error')
    })
    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={geometries}
      />
    )

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
    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={geometries}
      />
    )

    await waitFor(() => expect(mockGeometryGet).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with result error', async () => {
    mockResultLoad.mockImplementation(() => {
      throw new Error('result load error')
    })
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        results={results}
      />
    )

    await waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('result load error')
      )
    )

    unmount()
  })

  test('with result', async () => {
    mockResultLoad.mockImplementation(() => ({ type: 'result' }))
    const { unmount, rerender } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        results={results}
      />
    )

    await waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    await waitFor(() => screen.getByText('result', { exact: false }))

    rerender(
      <View
        project={project}
        simulation={simulation}
        geometries={[{ id: 'id2' }]}
        results={results}
      />
    )

    unmount()
  })

  test('with postprocessing error', async () => {
    mockResultLoad.mockImplementation(() => {
      throw new Error('postprocessing load error')
    })
    const { unmount } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        results={results}
        postprocessing={postprocessing}
      />
    )

    await waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('postprocessing load error')
      )
    )

    unmount()
  })

  test('with postprocessing', async () => {
    mockResultLoad.mockImplementation(() => ({ type: 'result' }))
    const { unmount, rerender } = render(
      <View
        project={project}
        simulation={simulation}
        geometries={geometries}
        results={results}
        postprocessing={postprocessing}
      />
    )

    await waitFor(() => expect(mockResultLoad).toHaveBeenCalledTimes(1))
    await waitFor(() => screen.getByText('result', { exact: false }))

    rerender(
      <View
        project={project}
        simulation={simulation}
        geometries={[{ id: 'id2' }]}
        results={results}
        postprocessing={postprocessing}
      />
    )

    unmount()
  })
})
