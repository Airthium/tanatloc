import Template from '../template'

const mockRenderFile = jest.fn()
jest.mock('ejs', () => ({
  renderFile: async () => mockRenderFile()
}))

const mockWriteFile = jest.fn()
jest.mock('../tools', () => ({
  writeFile: async () => mockWriteFile()
}))

describe('src/lib/template', () => {
  beforeEach(() => {
    mockRenderFile.mockReset()
    mockWriteFile.mockReset()
  })

  it('render', async () => {
    let script

    mockRenderFile.mockImplementation(() => 'ejs')

    // Without save
    script = await Template.render({}, {})
    expect(script).toBe('ejs')
    expect(mockRenderFile).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)

    // With save
    script = await Template.render({}, {}, {})
    expect(script).toBe('ejs')
    expect(mockRenderFile).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })
})
