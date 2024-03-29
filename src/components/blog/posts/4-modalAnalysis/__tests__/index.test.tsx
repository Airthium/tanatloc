import { render } from '@testing-library/react'

import Post from '../index'

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />
}))

jest.mock('../../layout', () => ({
  __esModule: true,
  Ref: () => <div />,
  default: (props: any) => <div>{props.children}</div>
}))

describe('components/blog/posts/4-modalAnalysis', () => {
  test('render', () => {
    const { unmount } = render(<Post.default />)

    unmount()
  })

  test('data', () => {
    expect(Post.key).toBeDefined()
    expect(Post.title).toBeDefined()
    expect(Post.description).toBeDefined()
    expect(Post.date).toBeDefined()
    expect(Post.image).toBeDefined()
    expect(Post.keywords).toBeDefined()
    expect(Post.author).toBeDefined()
  })
})
