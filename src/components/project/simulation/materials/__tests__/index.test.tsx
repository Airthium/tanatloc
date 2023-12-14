import { fireEvent, render, screen } from '@testing-library/react'

import Materials, {
  Geometry,
  Simulation
} from '@/components/project/simulation/materials'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: {}) => mockAddButton(props)
}))

const mockList = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/list',
  () => (props: {}) => mockList(props)
)

const mockMaterial = jest.fn()
jest.mock(
  '@/components/project/simulation/materials/material',
  () => (props: {}) => mockMaterial(props)
)

describe('components/project/simulation/materials', () => {
  const geometries = [
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Geometry,
    {
      id: 'id',
      name: 'name',
      summary: {}
    } as Geometry,
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
  } as unknown as Simulation
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

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Materials
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
      <Materials
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
      <Materials
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
      <Materials
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
        onClick={() => props.onEdit(0)}
        onKeyUp={console.debug}
      />
    ))
    mockMaterial.mockImplementation((props) => (
      <div>{JSON.stringify(props.material)}</div>
    ))
    const { unmount } = render(
      <Materials
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const list = screen.getByRole(ListRole)
    fireEvent.click(list)

    // screen.getByText(JSON.stringify({ uuid: 'uuid', selected: [] }))

    unmount()
  })

  test('onClose', () => {
    const AddButtonRole = 'AddButton'
    mockAddButton.mockImplementation((props) => (
      <div role={AddButtonRole} onClick={props.onAdd} onKeyUp={console.debug} />
    ))
    const MaterialRole = 'Material'
    mockMaterial.mockImplementation((props) => (
      <div
        role={MaterialRole}
        onClick={props.onClose}
        onKeyUp={console.debug}
      />
    ))
    const { unmount } = render(
      <Materials
        geometries={geometries}
        simulation={simulation}
        swr={swr}
        setVisible={setVisible}
      />
    )

    const add = screen.getByRole(AddButtonRole)
    fireEvent.click(add)

    const material = screen.getByRole(MaterialRole)
    fireEvent.click(material)

    unmount()
  })
})
