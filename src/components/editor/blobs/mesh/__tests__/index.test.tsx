import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Mesh from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

describe('components/editor/blobs/mesh', () => {
  const onAdd = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    onAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Mesh onAdd={onAdd} />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Mesh onAdd={onAdd} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onAdd', async () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(<Mesh onAdd={onAdd} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Mesh onAdd={onAdd} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
