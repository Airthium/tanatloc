import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Materials from '@/components/project/simulation/materials'

import { ISimulation } from '@/database/simulation/index'
import { SelectContext } from '@/context/select'
import { IFrontGeometriesItem } from '@/api/index.d'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: {}) => mockAddButton(props)
}))

const mockList = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/list',
  () => (props: {}) => mockList(props)
)

const mockMaterial = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/material',
  () => (props: {}) => mockMaterial(props)
)

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
jest.mock('@/context/select/actions', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType()
}))

describe('components/project/simulation/materials', () => {
  const geometries = [
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
  ]
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 1,
          title: 'Materials',
          values: [
            {
              uuid: 'uuid',
              selected: []
            }
          ]
        }
      }
    }
  } as ISimulation
  const swr = {
    mutateOneSimulation: jest.fn()
  }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockList.mockReset()
    mockList.mockImplementation(() => <div />)

    mockMaterial.mockReset()
    mockMaterial.mockImplementation(() => <div />)

    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <Materials
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    expect(mockSetType).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('render - 2D', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <Materials
          geometries={[
            {
              ...geometries[0],
              summary: {
                uuid: 'uuid',
                type: 'geometry2D',
                dimension: 2
              }
            }
          ]}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    expect(mockSetType).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('no geometry', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <Materials
          geometries={[]}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

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
        <Materials
          geometries={geometries}
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
      <div role="List" onClick={() => props.onEdit(0)} />
    ))
    mockMaterial.mockImplementation((props) => (
      <div>{JSON.stringify(props.material)}</div>
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <Materials
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)
    expect(mockEnable).toHaveBeenCalledTimes(1)

    screen.getByText(JSON.stringify({ uuid: 'uuid', selected: [] }))

    unmount()
  })

  test('onClose', () => {
    mockMaterial.mockImplementation((props) => (
      <div role="Material" onClick={props.onClose} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <Materials
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          setVisible={setVisible}
        />
      </SelectContext.Provider>
    )

    const material = screen.getByRole('Material')
    fireEvent.click(material)
    expect(mockDisable).toHaveBeenCalledTimes(1)

    unmount()
  })
})
