import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Materials from '@/components/project/simulation/materials'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props) => mockAddButton(props)
}))

const mockList = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/list',
  () => (props: {}) => mockList(props)
)

const mockMaterial = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/material',
  () => (props) => mockMaterial(props)
)

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
const mockSetPart = jest.fn()
jest.mock('@/store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType(),
  setPart: () => mockSetPart()
}))

describe('components/project/simulation/materials', () => {
  const geometry = {
    id: 'id',
    summary: {
      solids: [
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
  }
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
    mockSetPart.mockReset()

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Materials
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    expect(mockSetPart).toHaveBeenCalledTimes(1)
    expect(mockSetType).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('without geometry', () => {
    const { unmount } = render(
      <Materials simulation={simulation} swr={swr} setVisible={setVisible} />
    )

    unmount()
  })

  test('onAdd', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Materials
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const add = screen.getByRole('AddButton')
    fireEvent.click(add)
    expect(mockEnable).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onEdit', () => {
    mockList.mockImplementation((props) => (
      <div role="List" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Materials
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)
    expect(mockEnable).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onClose', () => {
    mockMaterial.mockImplementation((props) => (
      <div role="Material" onClick={props.close} />
    ))
    const { unmount } = render(
      <Materials
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const material = screen.getByRole('Material')
    fireEvent.click(material)
    expect(mockDisable).toHaveBeenCalledTimes(1)

    unmount()
  })
})
