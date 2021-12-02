import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Initialization from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/initialization', () => {
  const visible = true
  const initialization = null
  const onOk = jest.fn()
  const onClose = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    onOk.mockReset()
    onClose.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Initialization
        visible={visible}
        initialization={initialization}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('direct, add/remove form', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(
      <Initialization
        visible={visible}
        initialization={initialization}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const radio = screen.getAllByRole('radio')
    fireEvent.click(radio[0])

    const add = screen.getByRole('button')
    fireEvent.click(add)

    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('coupling, add/remove form', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(
      <Initialization
        visible={visible}
        initialization={initialization}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const radio = screen.getAllByRole('radio')
    fireEvent.click(radio[1])

    const add = screen.getByRole('button')
    fireEvent.click(add)

    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('onOk', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <Initialization
        visible={visible}
        initialization={initialization}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('With initialValues', async () => {
    const { unmount } = render(
      <Initialization
        visible={visible}
        initialization={{
          key: 'direct',
          label: 'label',
          children: [
            {
              label: 'label',
              default: 0
            }
          ]
        }}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })
})
