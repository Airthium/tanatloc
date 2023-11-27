import { ClientPlugin } from '@/plugins/index.d'

import { extra } from '../extra'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/extra', () => {
  test('call', async () => {
    await extra({} as ClientPlugin, 'action')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
