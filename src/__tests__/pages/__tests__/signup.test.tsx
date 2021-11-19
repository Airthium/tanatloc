import React from 'react'
import { render } from '@testing-library/react'

import Signup from '@/pages/signup'
import Send from '@/pages/signup/send'
import Validation from '@/pages/signup/validation'

jest.mock('@/components/signup', () => () => <div />)
jest.mock('@/components/signup/send', () => () => <div />)
jest.mock('@/components/signup/validation', () => () => <div />)

describe('pages/signup', () => {
  test('signup', () => {
    const { unmount } = render(<Signup />)

    unmount()
  })

  test('send', () => {
    const { unmount } = render(<Send />)

    unmount()
  })

  test('validation', () => {
    const { unmount } = render(<Validation />)

    unmount()
  })
})
