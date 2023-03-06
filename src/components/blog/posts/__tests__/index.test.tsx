import Posts from '..'

jest.mock('../1-poisson', () => ({}))
jest.mock('../2-stokes', () => ({}))

describe('components/blog/posts', () => {
  test('exists', () => {
    expect(Posts.length)
  })
})
