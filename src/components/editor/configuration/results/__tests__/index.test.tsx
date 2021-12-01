import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'antd'

import Results from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/results', () => {
  const visible = true
  const results = null
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
      <Results
        visible={visible}
        results={results}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('add/remove form', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(
      <Results
        visible={visible}
        results={results}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const add = screen.getAllByRole('button')
    fireEvent.click(add[0])
    fireEvent.click(add[1])

    const del = screen.getAllByRole('button', { name: 'delete' })
    fireEvent.click(del[0])
    fireEvent.click(del[1])

    unmount()
  })

  test('onOk', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <Results
        visible={visible}
        results={results}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('with results', () => {
    const { unmount } = render(
      <Results
        visible={visible}
        results={{
          filter: { name: 'filter' }
        }}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })
})
