import { fireEvent, render, screen } from '@testing-library/react'

import Blog from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery()
  })
}))

jest.mock('../../../../package.json', () => ({
  version: 'version'
}))

jest.mock('@/lib/utils', () => ({
  stringToColor: () => '#fff'
}))

jest.mock('../posts', () => [
  {
    key: 'post1',
    title: 'title1',
    description: 'description1',
    date: 'date1',
    image: 'img1',
    keywords: ['keyword1', 'keyword2'],
    author: { name: 'name1', url: 'url1' },
    default: () => <div />
  },
  {
    key: 'post2',
    title: 'title2',
    description: 'description2',
    date: 'date2',
    image: 'img2',
    keywords: ['keyword2'],
    author: { name: 'name2', url: 'url2' },
    default: () => <div />
  }
])

describe('components/blog', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Blog />)

    unmount()
  })

  test('query', () => {
    mockQuery.mockImplementation(() => ({ post: 'post' }))
    const { unmount, rerender } = render(<Blog />)

    mockQuery.mockImplementation(() => ({ post: 'post1' }))
    rerender(<Blog />)

    unmount()
  })

  test('onTanatloc', () => {
    const { unmount } = render(<Blog />)

    const button = screen.getByRole('img', { name: 'Tanatloc' })
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenLastCalledWith('/')

    unmount()
  })

  test('onSearch', () => {
    const { unmount } = render(<Blog />)

    const search = screen.getByRole('textbox')
    fireEvent.change(search, { target: { value: 'title' } })

    fireEvent.change(search, { target: { value: 'title1' } })

    fireEvent.change(search, { target: { value: 'title11' } })

    unmount()
  })

  test('sort', () => {
    const { unmount } = render(<Blog />)

    const down = screen.getByRole('button', { name: 'arrow-down' })
    const up = screen.getByRole('button', { name: 'arrow-up' })

    fireEvent.click(down)
    fireEvent.click(up)

    unmount()
  })

  test('tags', async () => {
    const { unmount } = render(<Blog />)

    const select = screen.getByRole('combobox')

    fireEvent.mouseDown(select)

    const option1 = screen.getAllByText('keyword1')
    fireEvent.click(option1[2])

    // TODO does not display because of maxTagCount="responsive"
    // const close = screen.getByRole('img', { name: 'close' })
    // fireEvent.click(close)

    unmount()
  })

  test('blog', () => {
    const { unmount } = render(<Blog />)

    const card = screen.getByRole('img', { name: 'title1' })
    fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: '/blog',
      query: { post: 'post1' }
    })

    unmount()
  })
})
