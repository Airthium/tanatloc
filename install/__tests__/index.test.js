/**
 * @jest-environment node
 */

import install from '../'

jest.mock('../dB', () => jest.fn())
jest.mock('../storage', () => jest.fn())

describe('install', () => {
  test('call', () => {
    expect(install).toBeDefined()
  })
})
