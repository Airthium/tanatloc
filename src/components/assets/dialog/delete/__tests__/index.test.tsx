import React from 'react'
import { render } from '@testing-library/react'

import DeleteDialog from '@/components/assets/dialog/delete'

describe('components/assets/dialog', () => {
  test('render', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={false}
        onCancel={jest.fn}
        onOk={jest.fn}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    unmount()
  })
})
