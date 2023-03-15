import Posts from '..'

jest.mock('../1-poisson', () => ({}))
jest.mock('../2-stokes', () => ({}))
jest.mock('../3-linearElasticity', () => ({}))
jest.mock('../4-modalAnalysis', () => ({}))
jest.mock('../5-thermalDiffusion', () => ({}))

describe('components/blog/posts', () => {
  test('exists', () => {
    expect(Posts.length)
  })
})
