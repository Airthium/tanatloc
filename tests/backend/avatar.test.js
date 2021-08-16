import { promises as fs } from 'fs'

import route from '@/route/avatar'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import UserLib from '@/lib/user'
import AvatarLib from '@/lib/avatar'
import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'

// Initialize
let adminUUID
let workspace
let project
beforeAll((done) => {
  initialize()
    .then((res) => (adminUUID = res))
    .catch(console.error)
    .finally(() => {
      // Create workspace & project
      WorkspaceLib.add({ id: adminUUID }, { name: 'Test workspace' })
        .then((w) => {
          workspace = w
          ProjectLib.add(
            { id: adminUUID },
            {
              workspace: { id: workspace.id },
              project: {
                title: 'Test project',
                description: 'Test description'
              }
            }
          )
            .then((p) => {
              project = p
              done()
            })
            .catch(console.error)
        })
        .catch(console.error)
    })
}, 0) // No timeout

// Clean
afterAll((done) => {
  clean()
    .catch((err) => console.error(err))
    .finally(done)
})

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/avatar', () => {
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

    resStatus = undefined
    resJson = undefined
  })

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ message: 'Unauthorized' })
  })

  test('Wrong method', async () => {
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(405)
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

    // No body
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file
    req.body = {
      file: {}
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file uid
    req.body = {
      file: {
        name: 'name'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file data
    req.body = {
      file: {
        name: 'name',
        uid: 'uid'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Start read / write operations
    let avatarId
    let previousAvatarId
    let avatar
    let previousAvatar
    let content
    let previousContent
    let userData
    let projectData

    // Body with file
    req.body = {
      file: {
        name: 'name1',
        uid: 'uid1',
        data: 'data1'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    avatarId = resJson.id
    expect(resJson).toEqual({ id: avatarId, name: 'name1' })

    avatar = await AvatarLib.get(avatarId, ['name', 'path'])
    expect(avatar).toEqual({ id: avatarId, name: 'name1', path: 'uid1' })

    content = await AvatarLib.read(avatarId)
    expect(content.toString()).toBe('data1')

    userData = await UserLib.get(adminUUID, ['avatar'], false)
    expect(userData.avatar).toBe(avatarId)

    // Body with file, previous avatar
    previousAvatarId = avatarId
    req.body = {
      file: {
        name: 'name2',
        uid: 'uid2',
        data: 'data2'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    avatarId = resJson.id
    expect(resJson).toEqual({ id: avatarId, name: 'name2' })

    avatar = await AvatarLib.get(avatarId, ['name', 'path'])
    expect(avatar).toEqual({ id: avatarId, name: 'name2', path: 'uid2' })

    content = await AvatarLib.read(avatarId)
    expect(content.toString()).toBe('data2')

    previousAvatar = await AvatarLib.get(previousAvatarId, ['name', 'path'])
    expect(previousAvatar).not.toBeDefined()

    try {
      await AvatarLib.read(previousAvatarId)
      expect(true).toBe(false)
    } catch (err) {
      expect(err).toEqual(new Error('Avatar does not exist.'))
    }

    userData = await UserLib.get(adminUUID, ['avatar'], false)
    expect(userData.avatar).toBe(avatarId)

    // Body with project & file
    previousAvatarId = avatarId
    req.body = {
      project: { id: project.id },
      file: {
        name: 'name3',
        uid: 'uid3',
        data: 'data3'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    avatarId = resJson.id
    expect(resJson).toEqual({ id: avatarId, name: 'name3' })

    avatar = await AvatarLib.get(avatarId, ['name', 'path'])
    expect(avatar).toEqual({ id: avatarId, name: 'name3', path: 'uid3' })

    content = await AvatarLib.read(avatarId)
    expect(content.toString()).toBe('data3')

    previousAvatar = await AvatarLib.get(previousAvatarId, ['name', 'path'])
    expect(previousAvatar).toBeDefined()

    previousContent = await AvatarLib.read(previousAvatarId)
    expect(previousContent).toBeDefined()

    projectData = await ProjectLib.get(project.id, ['avatar'], false)
    expect(projectData.avatar).toBe(avatarId)

    // Body with project & file, previous avatar
    previousAvatarId = avatarId
    req.body = {
      project: { id: project.id },
      file: {
        name: 'name4',
        uid: 'uid4',
        data: 'data4'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    avatarId = resJson.id
    expect(resJson).toEqual({ id: avatarId, name: 'name4' })

    avatar = await AvatarLib.get(avatarId, ['name', 'path'])
    expect(avatar).toEqual({ id: avatarId, name: 'name4', path: 'uid4' })

    content = await AvatarLib.read(avatarId)
    expect(content.toString()).toBe('data4')

    previousAvatar = await AvatarLib.get(previousAvatarId, ['name', 'path'])
    expect(previousAvatar).not.toBeDefined()

    try {
      await AvatarLib.read(previousAvatarId)
      expect(true).toBe(false)
    } catch (err) {
      expect(err).toEqual(new Error('Avatar does not exist.'))
    }

    projectData = await ProjectLib.get(project.id, ['avatar'], false)
    expect(projectData.avatar).toBe(avatarId)

    // Unlink error
    previousAvatarId = avatarId
    req.body = {
      project: { id: project.id },
      file: {
        name: 'name5',
        uid: 'uid5',
        data: 'data5'
      }
    }
    jest.spyOn(fs, 'unlink').mockImplementation(() => {
      throw new Error('unlink error')
    })
    await route(req, res)
    expect(resStatus).toBe(200)
    avatarId = resJson.id
    expect(resJson).toEqual({ id: avatarId, name: 'name5' })

    avatar = await AvatarLib.get(avatarId, ['name', 'path'])
    expect(avatar).toEqual({ id: avatarId, name: 'name5', path: 'uid5' })

    content = await AvatarLib.read(avatarId)
    expect(content.toString()).toBe('data5')

    previousAvatar = await AvatarLib.get(previousAvatarId, ['name', 'path'])
    expect(previousAvatar).not.toBeDefined()

    // File exists but not dB entry
    try {
      await AvatarLib.read(previousAvatarId)
      expect(true).toBe(false)
    } catch (err) {
      expect(err).toEqual(new Error('Avatar does not exist.'))
    }

    projectData = await ProjectLib.get(project.id, ['avatar'], false)
    expect(projectData.avatar).toBe(avatarId)
  })
})
