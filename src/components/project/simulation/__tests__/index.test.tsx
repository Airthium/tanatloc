import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

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
  const user = {}
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

  test('render', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('Name2'))

    unmount()
  })

  test('onCancel', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('Name2'))

    const button = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(button)

    unmount()
  })

  test('no user', async () => {
    const { unmount } = render(
      <Simulation.Selector visible={visible} onOk={onOk} onCancel={onCancel} />
    )

    unmount()
  })

  test('plugins error', async () => {
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

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onSelect', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('Name2'))

    const model = screen.getByText('Name')
    fireEvent.click(model)

    unmount()
  })

  test('category', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('Name2'))

    const select = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.mouseDown(select)
    })

    const option = screen.getAllByText('category2')
    await act(async () => {
      fireEvent.click(option[1])
    })

    unmount()
  })

  test('onCreate', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('Name2'))

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

  test('authorized plugins', async () => {
    const { unmount } = render(
      <Simulation.Selector
        user={{ ...user, authorizedplugins: ['model'] }}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    await waitFor(() => screen.getByText('NamePlugin'))

    unmount()
  })
})

describe('components/project/simulation.Updater', () => {
  const user = {}
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      code: 'code',
      version: 'version',
      algorithm: 'algorithm',
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

  test('render', async () => {
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    await new Promise((resolve) => setTimeout(resolve, 200))

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(<Simulation.Updater user={user} swr={swr} />)

    unmount()
  })

  test('no user', async () => {
    const { unmount } = render(
      <Simulation.Updater simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error('list error')
    })

    const { unmount } = render(<Simulation.Updater user={user} swr={swr} />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('list error')
      )
    )

    unmount()
  })

  test('update', async () => {
    mockAddedDiff.mockImplementation(() => ({ key: 'key' }))
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    await waitFor(() => screen.getByRole('button', { name: 'OK' }))

    const yes = screen.getByRole('button', { name: 'OK' })
    fireEvent.click(yes)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(yes)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('close', async () => {
    mockUpdatedDiff.mockImplementation(() => ({ key: 'key' }))
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    await waitFor(() => screen.getByRole('img', { name: 'close' }))

    const close = screen.getByRole('img', { name: 'close' })
    fireEvent.click(close)

    unmount()
  })
})
