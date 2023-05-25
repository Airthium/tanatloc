import { get } from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ template: 'template' }]
  })
}))

describe('database/userModel/get', () => {
  test('call', async () => {
    const res = await get('id', ['template'])
    expect(res).toEqual({ id: 'id', template: 'template' })
  })
})
