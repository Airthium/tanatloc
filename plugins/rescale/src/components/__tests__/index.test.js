import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import Rescale from '..'

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
        cores: [256],
        memory: 10000,
        price: 10000,
        lowPriorityPrice: 2000
      }
    ],
    freefem: {
      versions: [
        { id: 'version1', version: 'version1' },
        { id: 'version2', version: 'version2' }
      ]
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
    fireEvent.click(radios[1])

    // Step 1 -> 2
    const next = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(next)

    // Fill form
    radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    const numberOfCores = screen.getByRole('spinbutton')
    fireEvent.input(numberOfCores, { target: { value: 1 } })
    const increase = screen.getByRole('button', { name: 'Increase Value' })
    const decrease = screen.getByRole('button', { name: 'Decrease Value' })
    for (let i = 0; i < 3; ++i) {
      fireEvent.mouseDown(increase)
      fireEvent.mouseUp(increase)
      if (i === 0) await waitFor(() => expect(+numberOfCores.value).toBe(512))
      if (i === 1) await waitFor(() => expect(+numberOfCores.value).toBe(768))
      if (i === 2) await waitFor(() => expect(+numberOfCores.value).toBe(768))
    }
    for (let i = 0; i < 3; ++i) {
      fireEvent.mouseDown(decrease)
      fireEvent.mouseUp(decrease)
      if (i === 0) await waitFor(() => expect(+numberOfCores.value).toBe(512))
      if (i === 1) await waitFor(() => expect(+numberOfCores.value).toBe(256))
      if (i === 2) await waitFor(() => expect(+numberOfCores.value).toBe(256))
    }

    const combobox = screen.getByRole('combobox')
    fireEvent.change(combobox, { target: { value: 'version1' } })

    // Step 2 -> end
    const ok = screen.getByRole('button', { name: 'Ok' })
    fireEvent.click(ok)
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onOk error', async () => {
    const { unmount } = render(<Rescale data={data} onSelect={onSelect} />)

    // Set visible
    fireEvent.click(screen.getByRole('button'))

    // Select one
    let radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    // Step 1 -> 2
    const next = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(next)

    // Fill form
    radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    const increase = screen.getByRole('button', { name: 'Increase Value' })
    const decrease = screen.getByRole('button', { name: 'Decrease Value' })
    fireEvent.mouseDown(increase)
    fireEvent.mouseDown(decrease)

    const combobox = screen.getByRole('combobox')
    fireEvent.change(combobox, { target: { value: 'version1' } })

    // Step 2 -> end
    onSelect.mockImplementation(() => {
      throw new Error()
    })
    const ok = screen.getByRole('button', { name: 'Ok' })
    fireEvent.click(ok)
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

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
