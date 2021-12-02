import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'antd'

import BoundaryCondition from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/boundaryCondition', () => {
  const visible = true
  const boundaryCondition = null
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
      <BoundaryCondition
        visible={visible}
        boundaryCondition={boundaryCondition}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('add/remove form', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(
      <BoundaryCondition
        visible={visible}
        boundaryCondition={boundaryCondition}
        onOk={onOk}
        onClose={onClose}
      />
    )

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
      <BoundaryCondition
        visible={visible}
        boundaryCondition={boundaryCondition}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('with initialValues', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={visible}
        boundaryCondition={{
          label: 'boundaryCondition',
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
