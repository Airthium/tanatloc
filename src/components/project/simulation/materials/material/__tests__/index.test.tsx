import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Material from '@/components/project/simulation/materials/material'

import { ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  GoBack: (props: {}) => mockGoBack(props)
}))

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: {}) => mockFormula(props)
)

const mockSelector = jest.fn()
jest.mock(
  '@/components/assets/selector',
  () => (props: {}) => mockSelector(props)
)

const mockDatabase = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/database',
  () => (props: {}) => mockDatabase(props)
)

const mockAdd = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/add',
  () => (props: {}) => mockAdd(props)
)

const mockEdit = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/edit',
  () => (props: {}) => mockEdit(props)
)

describe('components/project/simulation/materials/material', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 1,
          title: 'Material',
          children: [
            {
              label: 'Test',
              name: 'Test',
              htmlEntity: 'entity',
              unit: 'unit',
              default: 0
            }
          ]
        }
      }
    }
  } as ISimulation
  const geometry = {
    solids: [
      {
        uuid: 'uuid',
        number: 1
      }
    ]
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()

  beforeEach(() => {
    mockGoBack.mockReset()
    mockGoBack.mockImplementation(() => <div />)

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockSelector.mockReset()
    mockSelector.mockImplementation(() => <div />)

    mockDatabase.mockReset()
    mockDatabase.mockImplementation(() => <div />)

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => <div />)

    mockEdit.mockReset()
    mockEdit.mockImplementation(() => <div />)

    onClose.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Material
        visible={true}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('fill', () => {
    mockFormula.mockImplementation((props) => (
      <div role="Formula" onClick={() => props.onValueChange(1)} />
    ))
    mockSelector.mockImplementation((props) => (
      <div
        role="Selector"
        onClick={() => props.updateSelected([{ uuid: 'uuid' }])}
      />
    ))
    mockDatabase.mockImplementation((props) => (
      <div
        role="Database"
        onClick={() =>
          props.onSelect({
            children: [
              {
                symbol: 'Test'
              }
            ]
          })
        }
      />
    ))
    mockAdd.mockImplementation((props) => (
      <div role="Add" onClick={() => props.onError('error')}></div>
    ))
    const { unmount } = render(
      <Material
        visible={true}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
      />
    )

    // Database
    const database = screen.getByRole('Database')
    fireEvent.click(database)

    // Formula
    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)

    // Selector
    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    // Add
    const add = screen.getByRole('Add')
    fireEvent.click(add)

    // Close
    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('edit', () => {
    mockEdit.mockImplementation((props) => (
      <div role="Edit" onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <Material
        visible={true}
        simulation={simulation}
        geometry={geometry}
        material={
          {
            uuid: 'uuid',
            material: {},
            selected: [{ uuid: 'uuid', label: 1 }]
          } as IModelMaterialValue
        }
        swr={swr}
        onClose={onClose}
      />
    )

    // Edit
    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    unmount()
  })
})
