import { IModel } from '@/models/index.d'

import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/userModel/add', () => {
  test('call', async () => {
    const res = await add({ model: {} as IModel, template: '' }, { id: 'id' })
    expect(res).toEqual({
      id: 'id',
      model: {},
      template: '',
      owners: ['id']
    })
  })
})
