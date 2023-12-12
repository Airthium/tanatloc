import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulationTaskFile } from '@/database/simulation/index'
import { IFrontSimulationsItem } from '@/api/index.d'

import View, { errors } from '@/components/project/view'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockHighlight = jest.fn()
const mockSelect = jest.fn()
const mockSetPoint = jest.fn()
const mockSetData = jest.fn()
const mockSetPostProcessing = jest.fn()
jest.mock('@/context/select/actions', () => ({
  highlight: () => mockHighlight(),
  select: () => mockSelect(),
  setPoint: () => mockSetPoint(),
  setData: () => mockSetData(),
  setPostProcessing: () => mockSetPostProcessing()
}))

const mockGeometryGet = jest.fn()
jest.mock('@/api/geometry', () => ({
  getPart: async () => mockGeometryGet()
}))

const mockResultLoad = jest.fn()
jest.mock('@/api/result', () => ({
  load: async () => mockResultLoad()
}))

jest.mock('@/api/avatar', () => ({
  add: async () => {
    throw new Error('avatar error')
  }
}))

const mockUseSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulation: () => mockUseSimulation()
}))

jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { Renderer: () => <div /> }
}))
const mockRenderer = jest.fn()
jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return (props: any) => mockRenderer(props)
})
describe('components/project/view', () => {
  const project = {
    id: 'id',
    title: 'title'
  }
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        run: { postprocessing: {} }
      }
    }
  } as Pick<IFrontSimulationsItem, 'id' | 'scheme'>
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
    mockErrorNotification.mockReset()

    mockHighlight.mockReset()
    mockSelect.mockReset()
    mockSetPoint.mockReset()
    mockSetData.mockReset()
    mockSetPostProcessing.mockReset()

    mockGeometryGet.mockReset()

    mockResultLoad.mockReset()

    mockUseSimulation.mockReset()
    mockUseSimulation.mockImplementation(() => [{}])

    mockRenderer.mockReset()
    mockRenderer.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <View project={project} results={[]} geometries={[]} />
    )

    unmount()
  })

  test('with default simulation', () => {
    mockUseSimulation.mockImplementation(() => [{ id: '0' }])
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('geometry get error')
      )
    )

    unmount()
  })

  test('with geometry', async () => {
    mockGeometryGet.mockImplementation(() => ({
      summary: { type: 'geometry3D' }
    }))
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('result load error')
      )
    )

    unmount()
  })

  test('with result', async () => {
    mockResultLoad.mockImplementation(() => ({ summary: { type: 'result' } }))
    mockRenderer.mockImplementation((props: any) => (
      <div>{JSON.stringify(props.parts)}</div>
    ))
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.part,
        new Error('postprocessing load error')
      )
    )

    unmount()
  })

  test('with postprocessing', async () => {
    mockResultLoad.mockImplementation(() => ({ summary: { type: 'result' } }))
    mockRenderer.mockImplementation((props: any) => (
      <div>{JSON.stringify(props.parts)}</div>
    ))
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

  test('snapshot', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.snapshot.project.apiRoute}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('enable data', () => {
    mockUseSimulation.mockImplementation(() => [
      {
        tasks: [
          {
            datas: [{ x: 0, y: 1 }]
          }
        ]
      }
    ])
    const { unmount } = render(
      <View project={project} results={[]} geometries={[]} />
    )

    unmount()
  })

  test('highlight', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.selection.onHighlight}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockHighlight).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('select', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.selection.onSelect}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockSelect).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('point', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.selection.onPoint}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockSetPoint).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('data', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.onData}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockSetData).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('postProcessing', async () => {
    const RendererRole = 'Renderer'
    mockRenderer.mockImplementation((props: any) => (
      <div
        role={RendererRole}
        onClick={props.onPostProcessing}
        onKeyDown={console.debug}
      />
    ))

    const { unmount } = render(
      <View
        simulation={simulation}
        project={project}
        results={[]}
        geometries={[]}
      />
    )

    const renderer = screen.getByRole(RendererRole)
    fireEvent.click(renderer)

    await waitFor(() => expect(mockSetPostProcessing).toHaveBeenCalledTimes(1))

    unmount()
  })
})
