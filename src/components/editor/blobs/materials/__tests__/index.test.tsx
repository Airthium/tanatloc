import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Materials from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

describe('components/editor/blobs/materials', () => {
  const onAdd = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    onAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Materials onAdd={onAdd} />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Materials onAdd={onAdd} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onAdd', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({
            materials: [
              {
                symbol: 0
              }
            ]
          })
        }
      />
    ))
    const { unmount } = render(<Materials onAdd={onAdd} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Materials onAdd={onAdd} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('form', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)

    const { unmount } = render(
      <Form>
        <Materials onAdd={onAdd} />
      </Form>
    )

    const add = screen.getByRole('button', { name: 'plus Add material' })
    fireEvent.click(add)

    await waitFor(() => screen.getByRole('img', { name: 'minus-circle' }))

    const remove = screen.getByRole('img', { name: 'minus-circle' })
    fireEvent.click(remove)

    unmount()
  })
})
