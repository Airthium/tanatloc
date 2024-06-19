import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryCondition, {
  Geometry,
  Simulation
} from '@/components/project/simulation/boundaryConditions/boundaryCondition'

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

jest.mock('@/context/select/actions', () => ({
  enable: jest.fn,
  setType: jest.fn,
  setPart: jest.fn,
  disable: jest.fn
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
  const geometries = [
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Geometry
  ]
  const simulation: Simulation = {
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
                htmlEntity: 'formula',
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
                geometry: 'id',
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
              { label: 'label1', htmlEntity: 'formula', default: 1 },
              { label: 'label2', htmlEntity: 'formula', default: 2 },
              { label: 'label3', htmlEntity: 'formula', default: 3 }
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
        geometries={geometries}
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
        geometries={[{ id: 'id', summary: { dimension: 2 } } as Geometry]}
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
                      htmlEntity: 'formula',
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
    const GoBackRole = 'GoBack'
    mockCancelButton.mockImplementation((props) => (
      <button role={GoBackRole} onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    const goBack = screen.getByRole(GoBackRole)
    fireEvent.click(goBack)

    unmount()
  })

  test('Fill', () => {
    const FormulaRole = 'Formula'
    mockFormula.mockImplementation((props) => (
      <button
        role={FormulaRole}
        onClick={() => {
          props.onValueChange(1)
          props.onCheckedChange(true)
        }}
        onMouseMove={() => props.onUnitChange({})}
      />
    ))
    const SelectorRole = 'Selector'
    mockSelector.mockImplementation((props) => (
      <button
        role={SelectorRole}
        onClick={() => props.updateSelected([{ uuid: 'uuid' }])}
      />
    ))
    const AddRole = 'Add'
    mockAdd.mockImplementation((props) => (
      <button role={AddRole} onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        geometries={geometries}
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
    const formula = screen.getByRole(FormulaRole)
    fireEvent.click(formula)

    // Unit
    fireEvent.mouseMove(formula)

    // Selector
    const selector = screen.getByRole(SelectorRole)
    fireEvent.click(selector)

    // Add
    const add = screen.getByRole(AddRole)
    fireEvent.click(add)

    // Close
    const close = screen.getByRole('img', { name: 'close' })
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('edit', () => {
    const EditRole = 'Edit'
    mockEdit.mockImplementation((props) => (
      <button role={EditRole} onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <BoundaryCondition
        geometries={geometries}
        simulation={simulation}
        value={{
          uuid: 'uuid',
          name: 'name',
          type: {
            key: 'key',
            label: 'key'
          },
          geometry: 'id',
          values: [{}],
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

  test('geometry change', () => {
    const geometries = [
      {
        id: 'id1',
        name: 'name1',
        summary: {}
      } as Geometry,
      {
        id: 'id2',
        name: 'name2',
        summary: {}
      } as Geometry
    ]

    const { unmount } = render(
      <BoundaryCondition
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab) => fireEvent.click(tab))

    unmount()
  })
})
