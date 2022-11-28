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
  const geometry = {
    summary: {}
  } as Pick<IFrontGeometriesItem, 'summary'>
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
        visible={true}
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('not visible', () => {
    const { rerender, unmount } = render(
      <Material
        visible={true}
        geometry={geometry}
        simulation={simulation}
        material={
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

    rerender(
      <Material
        visible={false}
        geometry={geometry}
        simulation={simulation}
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
    mockCancelButton.mockImplementation((props) => (
      <div role="Cancel" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Material
        visible={true}
        geometry={geometry}
        simulation={simulation}
        swr={swr}
        onClose={onClose}
      />
    )

    // Formula
    const formula = screen.getByRole('Formula')
    fireEvent.click(formula)

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
        visible={true}
        geometry={geometry}
        simulation={simulation}
        material={
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
        visible={true}
        geometry={geometry}
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
                      htmlEntity: 'entity',
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
        material={
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

    unmount()
  })
})
