import React from 'react'
import { render } from '@testing-library/react'

import EditButton from '@/components/assets/button/edit'

describe('components/assets/button/add', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnEdit = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <EditButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onEdit={mockOnEdit}
      />
    )

    unmount()
  })

  test('disabled', () => {
    const { unmount } = render(
      <EditButton disabled={true} loading={mockLoading()} onEdit={mockOnEdit} />
    )

    unmount()
  })

  test('style', () => {
    const { unmount } = render(
      <EditButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        needMargin
        light
        dark
        bordered
        primary
        onEdit={mockOnEdit}
      />
    )

    unmount()
  })
})
