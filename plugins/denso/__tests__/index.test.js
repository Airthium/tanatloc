import Denso from '..'

jest.mock('../model/solderFilling', () => ({}))

describe('plugins/denso', () => {
  it('exists', () => {
    expect(Denso).toEqual({
      category: 'Model',
      key: 'denso',
      models: [{}]
    })
  })
})
