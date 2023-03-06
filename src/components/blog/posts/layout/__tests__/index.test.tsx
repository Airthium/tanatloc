import { fireEvent, render, screen } from '@testing-library/react'

import Layout from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('@/lib/utils', () => ({
  stringToColor: () => '#fff'
}))

describe('components/blog/post/layout', () => {
  const title = 'title'
  const date = 'date'
  const image = 'image'
  const keywords = ['keyword1']
  const author = {
    name: 'name',
    url: 'url'
  }
  const version = 'version'

  beforeEach(() => {
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Layout
        title={title}
        date={date}
        image={image}
        keywords={keywords}
        author={author}
        version={version}
      >
        <div />
      </Layout>
    )

    unmount()
  })

  test('go back', () => {
    const { unmount } = render(
      <Layout
        title={title}
        date={date}
        image={image}
        keywords={keywords}
        author={author}
        version={version}
      >
        <div />
      </Layout>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenLastCalledWith('/blog')

    unmount()
  })
})
