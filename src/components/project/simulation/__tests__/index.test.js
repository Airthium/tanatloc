import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Simulation from '@/components/project/simulation'

const mockAddedDiff = jest.fn()
const mockUpdatedDiff = jest.fn()
jest.mock('deep-object-diff', () => ({
  addedDiff: () => mockAddedDiff(),
  updatedDiff: () => mockUpdatedDiff()
}))

const mockMerge = jest.fn()
jest.mock('lodash.merge', () => () => mockMerge())

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/project/simulation/about', () => () => <div />)

jest.mock('@/components/project/simulation/geometry', () => () => <div />)

jest.mock('@/components/project/simulation/materials', () => () => <div />)

jest.mock('@/components/project/simulation/parameters', () => () => <div />)

jest.mock('@/components/project/simulation/boundaryConditions', () => () => (
  <div />
))

jest.mock('@/components/project/simulation/run', () => () => <div />)

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

jest.mock('@/models', () => [
  {
    name: 'Name',
    algorithm: 'algorithm',
    description: 'description'
  },
  {
    name: 'Name2',
    algorithm: 'algorithm2',
    description: 'description2'
  }
])

jest.mock('@/plugins', () => ({
  hpc: {
    category: 'HPC'
  },
  model: {
    category: 'Model',
    key: 'model',
    models: [
      {
        name: 'name',
        algorithm: 'pluginAlgorithm',
        description: 'pluginDescription'
      }
    ]
  },
  unauthorizedModel: {
    category: 'Model',
    key: 'unauthorized'
  }
}))

describe('components/project/simulation.Selector', () => {
  const user = {}
  const visible = true
  const onOk = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => {
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

    unmount()
  })

  test('onSelect', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={user}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    const model = screen.getByText('Name')
    fireEvent.click(model)

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

  test('authorized plugins', () => {
    const { unmount } = render(
      <Simulation.Selector
        user={{ ...user, authorizedplugins: ['model'] }}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    )

    unmount()
  })
})

describe('components/project/simulation.Updater', () => {
  const user = {}
  const simulation = {
    id: 'id',
    scheme: { algorithm: 'algorithm' }
  }
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockAddedDiff.mockReset()
    mockAddedDiff.mockImplementation(() => ({}))
    mockUpdatedDiff.mockReset()
    mockUpdatedDiff.mockImplementation(() => ({}))

    mockMerge.mockReset()

    mockUpdate.mockReset()

    mockError.mockReset()
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

  test('update', async () => {
    mockAddedDiff.mockImplementation(() => [{}])
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    const yes = screen.getByRole('button', { name: 'Yes' })
    fireEvent.click(yes)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(yes)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('cancel', async () => {
    mockUpdatedDiff.mockImplementation(() => [{}])
    const { unmount } = render(
      <Simulation.Updater user={user} simulation={simulation} swr={swr} />
    )

    const no = screen.getByRole('button', { name: 'No' })
    fireEvent.click(no)

    unmount()
  })
})
