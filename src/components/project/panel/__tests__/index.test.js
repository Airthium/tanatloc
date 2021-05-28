import React from 'react'
import { render } from '@testing-library/react'

import Panel from '@/components/project/panel'

describe('components/project/panel', () => {
  const onClose = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <Panel visible={true} title="title" onClose={onClose} />
    )

    unmount()
  })

  test('not visible', () => {
    const { unmount } = render(
      <Panel visible={false} title="title" onClose={onClose} />
    )

    unmount()
  })
})
