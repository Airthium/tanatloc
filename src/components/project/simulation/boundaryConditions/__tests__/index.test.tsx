import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryConditions from '@/components/project/simulation/boundaryConditions'

import { ISimulation } from '@/database/index.d'
import { SelectContext } from '@/context/select'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockList = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/list',
  () => (props: any) => mockList(props)
)

const mockBoundaryCondition = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/boundaryCondition',
  () => (props: any) => mockBoundaryCondition(props)
)

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
const mockSetPart = jest.fn()
jest.mock('@/context/select/actions', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType(),
  setPart: () => mockSetPart()
}))

describe('components/project/simulation/boundaryConditions', () => {
  const geometry = {
    id: 'id',
    summary: {
      uuid: 'uuid',
      faces: [
        {
          uuid: 'uuid',
          number: 1
        }
      ]
    }
  }
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {
        boundaryConditions: {
          index: 1,
          title: 'boundary conditions',
          dirichlet: {
            label: 'Dirichlet',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'label'
                },
                selected: []
              }
            ]
          }
        }
      }
    }
  } as ISimulation
  const swr = { mutateOneSimulation: jest.fn() }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockList.mockReset()
    mockList.mockImplementation(() => <div />)

    mockBoundaryCondition.mockReset()
    mockBoundaryCondition.mockImplementation(() => <div />)

    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()
    mockSetPart.mockReset()

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <BoundaryConditions
          geometry={geometry}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    expect(mockSetPart).toHaveBeenCalledTimes(1)
    expect(mockSetType).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('render - 2D', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <BoundaryConditions
          geometry={{
            ...geometry,
            dimension: 2
          }}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    expect(mockSetPart).toHaveBeenCalledTimes(1)
    expect(mockSetType).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onAdd', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <BoundaryConditions
          geometry={geometry}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    const add = screen.getByRole('AddButton')
    fireEvent.click(add)

    expect(mockEnable).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onEdit', () => {
    mockList.mockImplementation((props) => (
      <div role="List" onClick={() => props.onEdit('dirichlet', 0)} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <BoundaryConditions
          geometry={geometry}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)

    expect(mockEnable).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onClose', () => {
    mockBoundaryCondition.mockImplementation((props) => (
      <div role="BoundaryCondition" onClick={props.onClose} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <BoundaryConditions
          geometry={geometry}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    const boundaryCondition = screen.getByRole('BoundaryCondition')
    fireEvent.click(boundaryCondition)

    expect(mockDisable).toHaveBeenCalledTimes(1)

    unmount()
  })
})
