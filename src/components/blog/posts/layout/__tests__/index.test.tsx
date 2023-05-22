import { fireEvent, render, screen } from '@testing-library/react'

import Layout from '..'
import { Ref } from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async (route: string) => mockPush(route)
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
  const references = [
    {
      code: '1',
      date: '2023',
      author: 'Author',
      label: 'Label',
      journal: 'Journal'
    },
    {
      code: '2',
      date: '2023',
      author: 'Author',
      label: 'Label'
    }
  ]

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

  test('with references', () => {
    const { unmount } = render(
      <Layout
        title={title}
        date={date}
        image={image}
        keywords={keywords}
        author={author}
        version={version}
        references={references}
      >
        <div />
      </Layout>
    )

    unmount()
  })

  test('Ref', () => {
    const { unmount } = render(<Ref code="1" />)

    unmount()
  })
})
