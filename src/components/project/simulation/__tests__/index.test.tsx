import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Simulation, { errors } from '@/components/project/simulation'

const mockAddedDiff = jest.fn()
const mockUpdatedDiff = jest.fn()
jest.mock('deep-object-diff', () => ({
  addedDiff: () => mockAddedDiff(),
  updatedDiff: () => mockUpdatedDiff()
}))

const mockMerge = jest.fn()
jest.mock('lodash.merge', () => () => mockMerge())

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/components/assets/mathjax', () => ({
  Html: () => <div />
}))

jest.mock('@/components/project/simulation/about', () => () => <div />)

jest.mock('@/components/project/simulation/geometry', () => () => <div />)

jest.mock('@/components/project/simulation/materials', () => () => <div />)

jest.mock('@/components/project/simulation/parameters', () => () => <div />)

jest.mock('@/components/project/simulation/initialization', () => () => <div />)

jest.mock('@/components/project/simulation/boundaryConditions', () => () => (
  <div />
))

jest.mock('@/components/project/simulation/run', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

jest.mock('@/models', () => [
  {
    name: 'Name',
    category: 'category',
    algorithm: 'algorithm',
    description: 'description'
  },
  {
    name: 'Name2',
    category: 'category2',
    algorithm: 'algorithm2',
    description: 'description2'
  }
])

describe('components/project/simulation.Selector', () => {
  const user = {
    authorizedplugins: [],
    models: [{ algorithm: 'algorithm', name: 'Name User' }]
  }
  const visible = true
  const onOk = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => {
    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'hpc',
        category: 'HPC'
      },
      {
        key: 'model',
        category: 'Model',
        models: [
          {
            name: 'NamePlugin',
            algorithm: 'pluginAlgorithm',
            description: 'pluginDescription'
          }
        ]
      },
      {
        key: 'unauthorized',
        category: 'Model'
      }
    ])

    onOk.mockReset()
    onCancel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('Name2'))

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('Name2'))

    const button = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(button)

    unmount()
  })

  test('no user', () => {
    const { unmount } = render(
      <Simulation.Selector visible={visible} onOk={onOk} onCancel={onCancel} />
    )

    unmount()
  })

  test('plugins error', () => {
    mockList.mockImplementation(() => {
      throw new Error()
    })

    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => expect(mockList).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onTanatocSelect', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('Name2'))

    const model = screen.getByText('Name')
    fireEvent.click(model)

    unmount()
  })

  test('category (tanatloc)', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('Name2'))

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const option = screen.getAllByText('category2')
    fireEvent.click(option[1])

    unmount()
  })

  test('onCreate', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('Name2'))

    // Empty
    const create = screen.getByText('Create')
    fireEvent.click(create)
    expect(onOk).toHaveBeenCalledTimes(0)

    // With current
    const model = screen.getByText('Name')
    fireEvent.click(model)

    fireEvent.click(create)
    expect(onOk).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onUserSelect', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    const tab = screen.getByRole('tab', { name: 'User algorithm' })
    fireEvent.click(tab)

    waitFor(() => screen.getByText('Name User'))

    const model = screen.getByText('Name User')
    fireEvent.click(model)

    unmount()
  })

  test('category (user)', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    const tab = screen.getByRole('tab', { name: 'User algorithm' })
    fireEvent.click(tab)

    waitFor(() => screen.getByText('Name User'))

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const option = screen.getAllByText('category2')
    fireEvent.click(option[1])

    unmount()
  })

  test('authorized plugins', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={{ ...user, authorizedplugins: ['model'] }}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    waitFor(() => screen.getByText('NamePlugin'))

    unmount()
  })
})

describe('components/project/simulation.Updater', () => {
  const user = { authorizedplugins: [] }
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      code: 'code',
      version: 'version',
      algorithm: 'algorithm',
      //@ts-ignore
      configuration: undefined
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'hpc',
        category: 'HPC'
      },
      {
        key: 'model',
        category: 'Model',
        models: [
          {
            name: 'NamePlugin1',
            algorithm: 'pluginAlgorithm',
            description: 'pluginDescription'
          }
        ]
      },
      {
        key: 'unauthorized',
        category: 'Model'
      }
    ])

    mockAddedDiff.mockReset()
    mockAddedDiff.mockImplementation(() => ({}))
    mockUpdatedDiff.mockReset()
    mockUpdatedDiff.mockImplementation(() => ({}))

    mockMerge.mockReset()

    mockUpdate.mockReset()

    mockErrorNotification.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(<Simulation.Updater user={user} swr={swr} />)

    unmount()
  })

  test('no user', () => {
    const { unmount } = render(
      <Simulation.Updater simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('plugins error', () => {
    mockList.mockImplementation(() => {
      throw new Error('list error')
    })

    const { unmount } = render(<Simulation.Updater user={user} swr={swr} />)

    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('list error')
      )
    )

    unmount()
  })

  test('update', () => {
    mockAddedDiff.mockImplementation(() => ({ key: 'key' }))
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('update - error', () => {
    mockAddedDiff.mockImplementation(() => ({ key: 'key' }))
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })
})
