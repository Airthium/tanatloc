import Result from '..'

jest.mock('../load', () => ({
  load: jest.fn
}))

jest.mock('../download', () => ({
  download: jest.fn
}))

jest.mock('../archive', () => ({
  archive: jest.fn
}))

describe('api/result', () => {
  test('import', () => {
    expect(Result.load).toBeDefined()
    expect(Result.download).toBeDefined()
    expect(Result.archive).toBeDefined()
  })
})
