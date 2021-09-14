import route from '@/pages/api/plugin'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import UserLib from '@/lib/user'
import PluginLib from '@/lib/plugin'

// Initialization
let adminUUID
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    resolve()
  })
    .catch(console.error)
    .finally(done)
}, 20_000) // No timeout

// Clean
afterAll((done) => {
  clean().catch(console.error).finally(done)
})

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

// Plugins mock (mandatory mock because of laoding time)
const mockPluginInit = jest.fn()
jest.mock('@/lib/plugins', () => ({
  serverList: async () => [
    {
      key: 'key',
      lib: {
        init: (param) => mockPluginInit(param)
      }
    }
  ]
}))

describe('e2e/backend/plugin', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (code) => {
      resStatus = code
      return {
        json: (object) => {
          resJson = object
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  const setToken = async () => {
    req.headers = {
      cookie: 'token=' + (await encryptSession({ id: adminUUID })) + ';'
    }
  }

  beforeEach(() => {
    mockCaptureException.mockReset()

    mockPluginInit.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('Wrong method', async () => {
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Method method not allowed')
    )
  })

  test('Add', async () => {
    req.method = 'POST'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { key(string), needInit(?bool), configuration(object) }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { key(string), needInit(?bool), configuration(object) }'
      )
    )

    // Unauthorized
    req.body = {
      key: 'key',
      needInit: true,
      configuration: {
        config: true
      }
    }
    await route(req, res)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({ error: true, message: 'Access denied' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Access denied')
    )

    // User update
    await UserLib.update({ id: adminUUID }, [
      { key: 'authorizedplugins', value: ['key'] }
    ])

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
    expect(mockPluginInit).toHaveBeenLastCalledWith({ config: true })
  })

  test('Get', async () => {
    req.method = 'GET'
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    const pluginUUID = resJson.plugins[0].uuid
    expect(resJson).toEqual({
      plugins: [
        {
          uuid: pluginUUID,
          key: 'key',
          configuration: { config: true },
          needInit: true
        }
      ]
    })

    // Error
    jest.spyOn(PluginLib, 'getByUser').mockImplementationOnce(() => {
      throw new Error('Get by user error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get by user error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get by user error')
    )
  })

  test('Update', async () => {
    req.method = 'PUT'
    await setToken()

    // Wrong body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(object)}'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body(object)}')
    )

    // Get plugins
    const plugins = await PluginLib.getByUser({ id: adminUUID })
    const uuid = plugins[0].uuid

    // Normal
    req.body = { uuid, needInit: true, needReInit: true }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    jest.spyOn(PluginLib, 'update').mockImplementationOnce(() => {
      throw new Error('Update error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Update error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Update error')
    )
  })

  test('Delete', async () => {
    req.method = 'DELETE'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { uuid(uuid) } }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { uuid(uuid) } }')
    )

    // Get plugins
    const plugins = await PluginLib.getByUser({ id: adminUUID })
    const uuid = plugins[0].uuid

    // Normal
    req.body = { uuid }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    jest.spyOn(PluginLib, 'del').mockImplementationOnce(() => {
      throw new Error('Delete error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Delete error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Delete error')
    )
  })
})
