import { createPath, writeFile, convert, loadPart } from '../tools'

jest.mock('path', () => ({
  join: () => 'path'
}))

jest.mock('fs', () => ({
  promises: {
    mkdir: async () => {},
    writeFile: async () => {},
    readFile: async () => 'readFile'
  }
}))

let mockCallback
jest.mock('child_process', () => ({
  exec: (command, callback) => {
    mockCallback = callback
  }
}))

describe('src/lib/tools', () => {
  it('createPath', async () => {
    await createPath('location')
  })

  it('writeFile', async () => {
    await writeFile('location', {})
  })

  it('convert', async () => {
    convert('location', { name: 'name' })
    mockCallback()

    convert('location', { name: 'name' })
    mockCallback('error')
  })

  it('loadPart', async () => {
    let part

    // Full
    JSON.parse = () => ({
      solids: [{}],
      faces: [{}],
      edges: [{}]
    })
    part = await loadPart('target', 'file')
    expect(part).toEqual({
      solids: [{ buffer: 'readFile' }],
      faces: [{ buffer: 'readFile' }],
      edges: [{ buffer: 'readFile' }]
    })

    // Empty
    JSON.parse = () => ({})
    part = await loadPart('target', 'file')
    expect(part).toEqual({})
  })
})
