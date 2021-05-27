import Denso from '..'

jest.mock('../model/solderFilling', () => ({}))

describe('plugins/denso', () => {
  test('exists', () => {
    expect(Denso).toEqual({
      category: 'Model',
      key: 'denso',
      name: 'Denso',
      models: [{}]
    })
  })
})
