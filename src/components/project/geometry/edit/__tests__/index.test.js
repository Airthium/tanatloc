import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import Edit from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/project/geometry/edit', () => {
  const visible = true
  const geometry = { name: 'name' }
  const setVisible = jest.fn()
  const onEdit = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        visible={visible}
        geometry={geometry}
        setVisible={setVisible}
        onEdit={onEdit}
      />
    )

    unmount()
  })

  test('onEdit', async () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <Edit
        visible={visible}
        geometry={geometry}
        setVisible={setVisible}
        onEdit={onEdit}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    await waitFor(() => expect(onEdit).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Edit
        visible={visible}
        geometry={geometry}
        setVisible={setVisible}
        onEdit={onEdit}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
