import { render } from '@testing-library/react'

import Signup from '../signup.page'
import Send from '../signup/send.page'
import Validation from '../signup/validation.page'

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
