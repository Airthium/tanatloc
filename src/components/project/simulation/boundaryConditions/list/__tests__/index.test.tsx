import { fireEvent, render, screen } from '@testing-library/react'

import List, {
  Geometry,
  Simulation
} from '@/components/project/simulation/boundaryConditions/list'
import { SelectContext } from '@/context/select'

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/context/select/actions', () => ({
  enable: () => mockEnable(),
  setType: jest.fn,
  disable: () => mockDisable(),
  select: () => mockSelect(),
  setPart: jest.fn
}))

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: {}) => mockEditButton(props)
}))

jest.mock('../../delete', () => () => <div />)

describe('components/project/simulation/boundaryConditions/list', () => {
  const geometries = [
    {
      id: 'id',
      summary: { uuid: 'uuid' }
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
      configuration: {
        boundaryConditions: {
          index: 1,
          title: 'Boundary conditions',
          key: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                geometry: 'id',
                selected: [{ uuid: 'uuid', label: 1 }]
              }
            ]
          }
        }
      }
    }
  } as unknown as Simulation
  const swr = { mutateOneSimulation: jest.fn() }
  const onEdit = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSelect.mockReset()

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    onEdit.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          onEdit={onEdit}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('render 2D', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List
          geometries={[
            {
              ...geometries[0],
              summary: { uuid: 'uuid', dimension: 2 }
            } as Geometry
          ]}
          simulation={simulation}
          swr={swr}
          onEdit={onEdit}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('no geometry', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List
          geometries={geometries}
          simulation={
            {
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
                    title: 'Boundary conditions',
                    key: {
                      label: 'label',
                      values: [
                        {
                          uuid: 'uuid',
                          name: 'name',
                          type: {
                            key: 'key',
                            label: 'key'
                          },
                          geometry: 'id1',
                          selected: [{ uuid: 'uuid', label: 1 }]
                        }
                      ]
                    }
                  }
                }
              }
            } as unknown as Simulation
          }
          swr={swr}
          onEdit={onEdit}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('highlight', () => {
    const EditButtonRole = 'EditButton'
    mockEditButton.mockImplementation((props) => (
      <button role={EditButtonRole} onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          selected: [{ uuid: 'uuid', label: 1 }],
          dispatch: jest.fn
        }}
      >
        <List
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          onEdit={onEdit}
        />
      </SelectContext.Provider>
    )

    const item = screen.getByText('name')
    fireEvent.mouseMove(item)
    expect(mockEnable).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(item)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    const edit = screen.getByRole(EditButtonRole)
    fireEvent.click(edit)

    fireEvent.mouseLeave(item)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('Edit', () => {
    Object.defineProperty(global, 'setTimeout', {
      value: (callback: Function) => callback()
    })
    const EditButtonRole = 'EditButton'
    mockEditButton.mockImplementation((props) => (
      <button role={EditButtonRole} onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List
          geometries={geometries}
          simulation={simulation}
          swr={swr}
          onEdit={onEdit}
        />
      </SelectContext.Provider>
    )

    const edit = screen.getByRole(EditButtonRole)
    fireEvent.click(edit)

    unmount()
  })
})
