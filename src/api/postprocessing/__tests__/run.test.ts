import { run } from '../run'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/postprocessing/run', () => {
  test('call', async () => {
    await run(
      { id: 'id' },
      { fileName: 'fileName', originPath: 'originPath' },
      'filter',
      ['1']
    )
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
