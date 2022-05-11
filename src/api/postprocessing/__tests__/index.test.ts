import Postprocessing from '..'

jest.mock('../run', () => ({ run: jest.fn }))

describe('api/postprocessing', () => {
  test('import', () => {
    expect(Postprocessing).toBeDefined()
    expect(Postprocessing.run).toBeDefined()
  })
})
