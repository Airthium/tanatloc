import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryCondition from '@/components/project/simulation/boundaryConditions/boundaryCondition'

const mockGoBack = jest.fn()
jest.mock('@/components/assets/button', () => ({
  GoBack: (props: {}) => mockGoBack(props)
}))

const mockFormula = jest.fn()
jest.mock('@/components/assets/formula', () => (props) => mockFormula(props))

const mockSelector = jest.fn()
jest.mock('@/components/assets/selector', () => (props) => mockSelector(props))

jest.mock(
  '@/components/project/simulation/boundaryConditions/add',
  () => () => <div />
)

jest.mock(
  '@/components/project/simulation/boundaryConditions/edit',
  () => () => <div />
)

describe('components/project/simulation/boundaryConditions/boundaryCondition', () => {
  const simulation = {
    id: 'id'
  }
  const geometry = {
    faces: []
  }
  const boundaryConditions = {
    index: 1,
    title: 'title',
    key: {
      label: 'label',
      children: [
        {
          label: 'label',
          htmlEntity: 'entity',
          default: 0
        }
      ],
      values: [
        {
          uuid: 'uuid',
          name: 'name',
          type: {
            key: 'key',
            label: 'key'
          },
          selected: []
        }
      ]
    },
    otherKey: {
      label: 'other'
    },
    otherOtherKey: {
      label: 'otherOther',
      children: [
        { label: 'label', htmlEntity: 'entity', default: 1 },
        { label: 'label', htmlEntity: 'entity', default: 2 },
        { label: 'label', htmlEntity: 'entity', default: 3 }
      ]
    }
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

    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        geometry={geometry}
        boundaryConditions={boundaryConditions}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  test('without boundaryConditions', () => {
    const { unmount } = render(
      //@ts-ignore
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  test('close', () => {
    mockGoBack.mockImplementation((props) => (
      <div role="GoBack" onClick={props.onClick} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        geometry={geometry}
        boundaryConditions={boundaryConditions}
        swr={swr}
        close={close}
      />
    )

    const goBack = screen.getByRole('GoBack')
    fireEvent.click(goBack)

    unmount()
  })

  test('Fill', () => {
    mockFormula.mockImplementation((props) => (
      <div
        role="Formula"
        onClick={() => {
          props.onValueChange(1)
          props.onCheckedChange(true)
        }}
      />
    ))
    mockSelector.mockImplementation((props) => (
      <div
        role="Selector"
        onClick={() => props.updateSelected([{ uuid: 'uuid' }])}
      />
    ))
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        geometry={geometry}
        boundaryConditions={boundaryConditions}
        swr={swr}
        close={close}
      />
    )

    // Name
    const input = screen.getByRole('textbox')
    fireEvent.input(input, { target: { value: 'BC' } })

    // Type
    const radios = screen.getAllByRole('radio')
    // Without children
    fireEvent.click(radios[1])

    // With three children
    fireEvent.click(radios[2])

    // With child
    fireEvent.click(radios[0])

    // Value
    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)

    // Selector
    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    unmount()
  })

  test('edit', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        geometry={geometry}
        boundaryConditions={boundaryConditions}
        boundaryCondition={{
          uuid: 'uuid',
          name: 'name',
          type: {
            key: 'key',
            label: 'key'
          },
          selected: [{ uuid: 'uuid', label: 1 }]
        }}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })
})
