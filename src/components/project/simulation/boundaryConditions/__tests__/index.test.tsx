import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryConditions, {
  Geometry,
  Simulation
} from '@/components/project/simulation/boundaryConditions'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockList = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/list',
  () => (props: any) => mockList(props)
)

const mockBoundaryCondition = jest.fn()
jest.mock(
  '@/components/project/simulation/boundaryConditions/boundaryCondition',
  () => (props: any) => mockBoundaryCondition(props)
)

describe('components/project/simulation/boundaryConditions', () => {
  const geometries = [
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Geometry,
    {
      id: 'id1',
      name: 'name',
      summary: {}
    } as Geometry
  ]
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
        boundaryConditions: {
          index: 1,
          title: 'boundary conditions',
          dirichlet: {
            label: 'Dirichlet',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'label'
                },
                selected: []
              }
            ]
          }
        }
      }
    }
  } as unknown as Simulation
  const swr = { mutateOneSimulation: jest.fn() }
  const setVisible = jest.fn()

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockList.mockReset()
    mockList.mockImplementation(() => <div />)

    mockBoundaryCondition.mockReset()
    mockBoundaryCondition.mockImplementation(() => <div />)

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <BoundaryConditions
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    unmount()
  })

  test('render - 2D', () => {
    const { unmount } = render(
      <BoundaryConditions
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
    )

    unmount()
  })

  test('no geometry', () => {
    const { unmount } = render(
      <BoundaryConditions
        geometries={[]}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    unmount()
  })

  test('onAdd', () => {
    const AddButtonRole = 'AddButton'
    mockAddButton.mockImplementation((props) => (
      <div role={AddButtonRole} onClick={props.onAdd} onKeyUp={console.debug} />
    ))
    const { unmount } = render(
      <BoundaryConditions
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const add = screen.getByRole(AddButtonRole)
    fireEvent.click(add)

    unmount()
  })

  test('onEdit', () => {
    const ListRole = 'List'
    mockList.mockImplementation((props) => (
      <div
        role={ListRole}
        onClick={() => props.onEdit('dirichlet', 0)}
        onKeyUp={console.debug}
      />
    ))
    const { unmount } = render(
      <BoundaryConditions
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const list = screen.getByRole(ListRole)
    fireEvent.click(list)

    unmount()
  })

  test('onClose', () => {
    const AddButtonRole = 'AddButton'
    mockAddButton.mockImplementation((props) => (
      <div role={AddButtonRole} onClick={props.onAdd} onKeyUp={console.debug} />
    ))
    const BoundaryConditionRole = 'BoundaryCondition'
    mockBoundaryCondition.mockImplementation((props) => (
      <div
        role={BoundaryConditionRole}
        onClick={props.onClose}
        onKeyUp={console.debug}
      />
    ))
    const { unmount } = render(
      <BoundaryConditions
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const add = screen.getByRole(AddButtonRole)
    fireEvent.click(add)

    const boundaryCondition = screen.getByRole(BoundaryConditionRole)
    fireEvent.click(boundaryCondition)

    unmount()
  })
})
