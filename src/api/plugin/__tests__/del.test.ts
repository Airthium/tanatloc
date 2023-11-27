import { ClientPlugin } from '@/plugins/index.d'

import { del } from '../del'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/del', () => {
  test('call', async () => {
    await del({} as ClientPlugin)
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
