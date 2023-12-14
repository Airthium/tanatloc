import { render } from '@testing-library/react'

import Loading from '@/components/loading'

jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { extra: { Background: () => <div /> } }
}))

jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return () => <div />
})

Element.prototype.scrollTo = () => {}

describe('components/loading', () => {
  test('render', () => {
    const { unmount } = render(<Loading />)

    unmount()
  })

  test('status', () => {
    const { rerender, unmount } = render(<Loading status={[]} />)

    rerender(<Loading status={['test1', 'test2']} />)

    rerender(<Loading status={['test1', 'test2', 'test3', 'test4']} />)

    unmount()
  })

  test('status, err', () => {
    const { unmount } = render(
      <Loading
        status={['test1', 'test2']}
        errors={['error', 'docker: command not found', 'ENETUNREACH']}
      />
    )

    unmount()
  })

  test('err', () => {
    const { unmount } = render(
      <Loading errors={['error', 'docker: command not found', 'ENETUNREACH']} />
    )

    unmount()
  })

  test('simple', () => {
    const { unmount } = render(<Loading.Simple />)

    unmount()
  })
})
