import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Material from '@/components/project/simulation/materials/material'

const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  GoBack: (props) => mockGoBack(props)
}))

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockSelector = jest.fn()
jest.mock('@/components/assets/selector', () => (props) => mockSelector(props))

const mockDatabase = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/database',
  () => (props) => mockDatabase(props)
)

jest.mock('@/components/project/simulation/materials/add', () => () => <div />)

jest.mock('@/components/project/simulation/materials/edit', () => () => <div />)

describe('components/project/simulation/materials/material', () => {
  const simulation = {
    id: 'id'
  }
  const geometry = {
    solids: [
      {
        uuid: 'uuid',
        number: 1
      }
    ]
  }
  const materials = {
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
  const swr = { mutateOneSimulation: jest.fn() }
  const close = jest.fn()

  beforeEach(() => {
    mockGoBack.mockReset()
    mockGoBack.mockImplementation(() => <div />)

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockSelector.mockReset()
    mockSelector.mockImplementation(() => <div />)

    mockDatabase.mockReset()
    mockDatabase.mockImplementation(() => <div />)

    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Material
        simulation={simulation}
        visible={true}
        geometry={geometry}
        materials={materials}
        swr={swr}
        close={close}
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
    const { unmount } = render(
      <Material
        simulation={simulation}
        visible={true}
        geometry={geometry}
        materials={materials}
        swr={swr}
        close={close}
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

    // Close
    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('edit', () => {
    const { unmount } = render(
      <Material
        simulation={simulation}
        visible={true}
        geometry={geometry}
        materials={materials}
        material={{ uuid: 'uuid', selected: [{ uuid: 'uuid', label: 1 }] }}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })
})
