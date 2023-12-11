import { fireEvent, render, screen } from '@testing-library/react'

import Material from '@/components/project/simulation/materials/material'

import { ISimulation } from '@/database/simulation/index'
import { IModelMaterialsValue } from '@/models/index.d'
import { IFrontGeometriesItem } from '@/api/index.d'

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
  setPart: jest.fn
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
    } as Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
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
  } as ISimulation
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

  test('no materials', () => {
    const { unmount } = render(
      <Material
        geometries={geometries}
        simulation={
          {
            id: 'id',
            scheme: {
              configuration: {}
            }
          } as ISimulation
        }
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('fill', () => {
    mockFormula.mockImplementation((props) => (
      <div
        role="Formula"
        onClick={() => props.onValueChange(1)}
        onMouseMove={() => props.onUnitChange({})}
      />
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
    mockCancelButton.mockImplementation((props) => (
      <div role="Cancel" onClick={props.onCancel} />
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
    const formula = screen.getAllByRole('Formula')[0]
    fireEvent.click(formula)

    // Unit
    fireEvent.mouseMove(formula)

    // Database
    const database = screen.getByRole('Database')
    fireEvent.click(database)

    // Selector
    const selector = screen.getByRole('Selector')
    fireEvent.click(selector)

    // Add
    const add = screen.getByRole('Add')
    fireEvent.click(add)

    // Close
    const button = screen.getByRole('Cancel')
    fireEvent.click(button)
    expect(onClose).toHaveBeenCalledTimes(1)

    const close = screen.getByRole('img', { name: 'close' })
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('edit', () => {
    mockEdit.mockImplementation((props) => (
      <div role="Edit" onClick={() => props.onError('error')} />
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
    const edit = screen.getByRole('Edit')
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
                      uuid: 'uuid'
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
          } as ISimulation
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
      } as Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>,
      {
        id: 'id2',
        name: 'name2',
        summary: {}
      } as Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
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
