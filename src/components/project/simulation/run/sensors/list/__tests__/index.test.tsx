import { fireEvent, render, screen } from '@testing-library/react'

import List from '..'

import { IFrontSimulationsItem } from '@/api/index.d'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDelete = jest.fn()
jest.mock('../../delete', () => (props: any) => mockDelete(props))

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => callback()
})

describe('components/project/simulation/run/sensors/list', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        run: {
          sensors: [
            {
              name: 'name',
              point: { x: 0, y: 1, z: 2 },
              formula: 'formula'
            }
          ]
        }
      }
    } as IFrontSimulationsItem['scheme']
  }
  const onEdit = jest.fn()
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDelete.mockReset()

    onEdit.mockReset()
    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List simulation={simulation} onEdit={onEdit} swr={swr} />
    )

    unmount()
  })

  test('highlight / unhighlight', () => {
    const { unmount } = render(
      <List simulation={simulation} onEdit={onEdit} swr={swr} />
    )

    const card = screen.getByRole('list')
    fireEvent.mouseEnter(card)

    fireEvent.mouseLeave(card)

    unmount()
  })

  test('onEdit', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <List simulation={simulation} onEdit={onEdit} swr={swr} />
    )

    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    expect(onEdit).toHaveBeenCalledTimes(1)

    unmount()
  })
})
