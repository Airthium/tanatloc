import Services from '..'

jest.mock('../toThree', () => jest.fn)

jest.mock('../gmsh', () => jest.fn)

jest.mock('../freefem', () => jest.fn)

jest.mock('../pvpython', () => jest.fn)

describe('services', () => {
  test('import', () => {
    expect(Services.toThree).toBeDefined()
    expect(Services.gmsh).toBeDefined()
    expect(Services.freefem).toBeDefined()
    expect(Services.pvpython).toBeDefined()
  })
})
