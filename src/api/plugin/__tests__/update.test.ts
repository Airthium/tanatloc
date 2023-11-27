import { ClientPlugin } from '@/plugins/index.d'

import { update } from '../update'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/update', () => {
  test('call', async () => {
    await update({} as ClientPlugin)
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
