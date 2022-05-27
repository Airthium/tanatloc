import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import BoundaryCondition from '@/components/project/simulation/boundaryConditions/boundaryCondition'

const mockFormula = jest.fn()
jest.mock(
  '@/components/assets/formula',
  () => (props: any) => mockFormula(props)
)

const mockSelector = jest.fn()
jest.mock(
  '@/components/assets/selector',
  () => (props: any) => mockSelector(props)
)

const mockCancelButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  CancelButton: (props: {}) => mockCancelButton(props)
}))

const mockAdd = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/add',
  () => (props: {}) => mockAdd(props)
)

const mockEdit = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/edit',
  () => (props: {}) => mockEdit(props)
)

describe('components/project/simulation/boundaryConditions/boundaryCondition', () => {
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      //@ts-ignore
      configuration: {
        boundaryConditions: {
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
      }
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()

  beforeEach(() => {
    mockCancelButton.mockReset()
    mockCancelButton.mockImplementation(() => <div />)

    mockFormula.mockReset()
    mockFormula.mockImplementation(() => <div />)

    mockSelector.mockReset()
    mockSelector.mockImplementation(() => <div />)

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => <div />)

    mockEdit.mockReset()
    mockEdit.mockImplementation(() => <div />)

    onClose.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('no visible', () => {
    const { rerender, unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
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
        onClose={onClose}
      />
    )

    rerender(
      <BoundaryCondition
        visible={false}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('2D render', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              dimension: 2,
              boundaryConditions: {
                index: 1,
                title: 'title',
                key: {
                  label: 'label',
                  children: [
                    {
                      only3D: true,
                      label: 'label',
                      htmlEntity: 'entity',
                      default: 0
                    }
                  ],
                  values: []
                }
              }
            }
          }
        }}
        swr={swr}
        onClose={onClose}
      />
    )

    const radio = screen.getByRole('radio')
    fireEvent.click(radio)

    unmount()
  })

  test('close', () => {
    mockCancelButton.mockImplementation((props) => (
      <div role="GoBack" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
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
    mockAdd.mockImplementation((props) => (
      <div role="Add" onClick={() => props.onError('error')}></div>
    ))
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
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

    // Add
    const add = screen.getByRole('Add')
    fireEvent.click(add)

    // Close
    const close = screen.getByRole('img', { name: 'close' })
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('edit', () => {
    mockEdit.mockImplementation((props) => (
      <div role="Edit" onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
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
        onClose={onClose}
      />
    )

    // Edit
    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    unmount()
  })
})
