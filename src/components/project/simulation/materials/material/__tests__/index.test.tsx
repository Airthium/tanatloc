import { fireEvent, render, screen } from '@testing-library/react'

import Material, {
  Geometry,
  Simulation
} from '@/components/project/simulation/materials/material'

import { IModelMaterialsValue } from '@/models/index.d'

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
  CancelButton: (props: any) => mockCancelButton(props)
}))

jest.mock('@/context/select/actions', () => ({
  enable: jest.fn,
  setType: jest.fn,
  setPart: jest.fn,
  disable: jest.fn
}))

const mockDatabase = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/database',
  () => (props: any) => mockDatabase(props)
)

const mockAdd = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/add',
  () => (props: any) => mockAdd(props)
)

const mockEdit = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/edit',
  () => (props: any) => mockEdit(props)
)

describe('components/project/simulation/materials/material', () => {
  const geometries = [
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Geometry
  ]
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
              htmlEntity: 'formula',
              unit: 'unit',
              default: 0
            },
            {
              label: 'Test2',
              name: 'Test2',
              htmlEntity: 'formula',
              default: 1
            }
          ]
        }
      }
    }
  } as Simulation
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()

  beforeEach(() => {
    mockCancelButton.mockReset()
    mockCancelButton.mockImplementation(() => <div />)

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
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('fill', () => {
    const FormulaRole = 'Formula'
    mockFormula.mockImplementation((props) => (
      <button
        role={FormulaRole}
        onClick={() => props.onValueChange(1)}
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
    const DatabaseRole = 'Database'
    mockDatabase.mockImplementation((props) => (
      <button
        role={DatabaseRole}
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
    const AddRole = 'Add'
    mockAdd.mockImplementation((props) => (
      <button role={AddRole} onClick={() => props.onError('error')} />
    ))
    const CancelRole = 'Cancel'
    mockCancelButton.mockImplementation((props) => (
      <button role={CancelRole} onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Material
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    // Formula
    const formula = screen.getAllByRole(FormulaRole)[0]
    fireEvent.click(formula)

    // Unit
    fireEvent.mouseMove(formula)

    // Database
    const database = screen.getByRole(DatabaseRole)
    fireEvent.click(database)

    // Selector
    const selector = screen.getByRole(SelectorRole)
    fireEvent.click(selector)

    // Add
    const add = screen.getByRole(AddRole)
    fireEvent.click(add)

    // Close
    const button = screen.getByRole(CancelRole)
    fireEvent.click(button)
    expect(onClose).toHaveBeenCalledTimes(1)

    const close = screen.getByRole('img', { name: 'close' })
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('edit', () => {
    const EditRole = 'Edit'
    mockEdit.mockImplementation((props) => (
      <button role={EditRole} onClick={() => props.onError('error')} />
    ))
    const { unmount } = render(
      <Material
        geometries={geometries}
        simulation={simulation}
        value={
          {
            uuid: 'uuid',
            material: {},
            selected: [{ uuid: 'uuid', label: 1 }]
          } as IModelMaterialsValue
        }
        swr={swr}
        onClose={onClose}
      />
    )

    // Edit
    const edit = screen.getByRole(EditRole)
    fireEvent.click(edit)

    unmount()
  })

  test('with values', () => {
    const { unmount } = render(
      <Material
        geometries={geometries}
        simulation={
          {
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
                      htmlEntity: 'formula',
                      unit: 'unit',
                      default: 0
                    }
                  ],
                  values: [
                    {
                      uuid: 'uuid',
                      material: {}
                    },
                    {
                      uuid: 'uuid2',
                      material: {
                        label: 'Label'
                      }
                    }
                  ]
                }
              }
            }
          } as unknown as Simulation
        }
        value={
          {
            uuid: 'uuid',
            material: {},
            geometry: 'id',
            selected: [{ uuid: 'uuid', label: 1 }]
          } as IModelMaterialsValue
        }
        swr={swr}
        onClose={onClose}
      />
    )

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
        summary: { dimension: 2 }
      } as Geometry
    ]

    const { unmount } = render(
      <Material
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
