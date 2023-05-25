import { IModel } from '@/models/index.d'

import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/userModel/add', () => {
  test('call', async () => {
    await add({ model: {} as IModel, template: 'template' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
