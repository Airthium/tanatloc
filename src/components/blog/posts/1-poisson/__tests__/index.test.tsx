import { render } from '@testing-library/react'

import Post, {
  author,
  date,
  description,
  image,
  key,
  keywords,
  title
} from '../index'

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />
}))

jest.mock('../../layout', () => (props: any) => <div>{props.children}</div>)

describe('components/blog/posts/1-poisson', () => {
  test('render', () => {
    const { unmount } = render(<Post />)

    unmount()
  })

  test('data', () => {
    expect(key).toBeDefined()
    expect(title).toBeDefined()
    expect(description).toBeDefined()
    expect(date).toBeDefined()
    expect(image).toBeDefined()
    expect(keywords).toBeDefined()
    expect(author).toBeDefined()
  })
})
