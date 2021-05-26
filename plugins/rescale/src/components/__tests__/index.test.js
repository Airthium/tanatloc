import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import Rescale from '..'

import '@/config/jest/mockMatchMedia'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

describe('plugins/rescale/src/components/index', () => {
  const data = {
    coreTypes: [
      {
        name: 'coretype 1',
        cores: [1, 2, 4],
        memory: 5000,
        price: 5000,
        lowPriorityPrice: 1000
      },
      {
        name: 'coretype 2',
        cores: [8, 16, 32],
        memory: 10000,
        price: 10000,
        lowPriorityPrice: 2000
      }
    ],
    freefem: {
      versions: [{ id: 'version', version: 'version' }]
    }
  }
  const onSelect = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    onSelect.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Rescale data={data} onSelect={onSelect} />)

    unmount()
  })

  test('rowSelection', () => {
    const { unmount } = render(<Rescale data={data} onSelect={onSelect} />)

    // Set visible
    fireEvent.click(screen.getByRole('button'))

    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])
    fireEvent.click(radios[1])

    unmount()
  })

  test('onOk', async () => {
    const { unmount } = render(<Rescale data={data} onSelect={onSelect} />)

    // Set visible
    fireEvent.click(screen.getByRole('button'))

    // Select one
    let radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    // Step 1 -> 2
    let buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3])

    // Fill form
    radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    const spinbutton = screen.getByRole('spinbutton')
    fireEvent.input(spinbutton, { target: { value: 1 } })
    fireEvent.input(spinbutton, { target: { value: 8 } })
    fireEvent.input(spinbutton, { target: { value: 4 } })

    const combobox = screen.getByRole('combobox')
    fireEvent.change(combobox, { target: { value: 'version' } })

    // Step 2 -> end
    buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[5])
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(<Rescale data={data} onSelect={onSelect} />)

    // Set visible
    fireEvent.click(screen.getByRole('button'))

    // Step 1
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2])

    unmount()
  })
})
