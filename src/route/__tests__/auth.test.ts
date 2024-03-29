import { IProjectGet, IWorkspaceGet } from '@/lib/index.d'
import auth, {
  checkWorkspaceAuth,
  checkProjectAuth,
  checkGeometryAuth,
  checkSimulationAuth,
  checkOrganizationAuth
} from '../auth'

const mockError = jest.fn()
jest.mock('../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockProjectGet = jest.fn()
jest.mock('@/lib/project', () => ({
  get: async () => mockProjectGet()
}))

const mockWorkspaceGet = jest.fn()
jest.mock('@/lib/workspace', () => ({
  get: async () => mockWorkspaceGet()
}))

const mockGroupGet = jest.fn()
jest.mock('@/lib/group', () => ({
  get: async () => mockGroupGet()
}))

const mockGeometryGet = jest.fn()
jest.mock('@/lib/geometry', () => ({
  get: async () => mockGeometryGet()
}))

const mockSimulationGet = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockSimulationGet()
}))

const mockOrganizationGet = jest.fn()
jest.mock('@/lib/organization', () => ({
  get: async () => mockOrganizationGet()
}))

type ProjectGet = IProjectGet<('owners' | 'users' | 'groups')[]>
type WorkspaceGet = IWorkspaceGet<('owners' | 'users' | 'groups')[]>

describe('route/auth', () => {
  beforeEach(() => {
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockWorkspaceGet.mockReset()

    mockProjectGet.mockReset()

    mockGroupGet.mockReset()

    mockGeometryGet.mockReset()

    mockSimulationGet.mockReset()

    mockOrganizationGet.mockReset()
  })

  test('authorized', async () => {
    let res

    res = await auth({ id: 'id' }, {
      id: 'id',
      owners: ['id']
    } as ProjectGet)
    expect(res).toBe(true)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', owners: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(true)

    res = await auth({ id: 'id' }, {
      id: 'id',
      owners: ['id'],
      users: ['id']
    } as ProjectGet)
    expect(res).toBe(true)

    res = await auth({ id: 'id' }, { id: 'id', users: ['id'] } as ProjectGet)
    expect(res).toBe(true)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', users: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(true)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id'] }))
    res = await auth(
      { id: 'id' },
      { id: 'id', groups: ['id'] } as ProjectGet,
      { id: 'id' } as WorkspaceGet
    )
    expect(res).toBe(true)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(true)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id'] }))
    res = await auth(
      { id: 'id' },
      { id: 'id', groups: ['id'] } as ProjectGet,
      { id: 'id' } as WorkspaceGet
    )
    expect(res).toBe(true)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(true)
  })

  test('not authorized', async () => {
    let res

    res = await auth({ id: 'id' }, { id: 'id' } as ProjectGet)
    expect(res).toBe(false)

    res = await auth({ id: 'id' }, { id: 'id', owners: ['id2'] } as ProjectGet)
    expect(res).toBe(false)

    res = await auth({ id: 'id' }, {
      id: 'id',
      owners: ['id2'],
      users: ['id2']
    } as ProjectGet)
    expect(res).toBe(false)

    res = await auth({ id: 'id' }, { id: 'id', users: ['id2'] } as ProjectGet)
    expect(res).toBe(false)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id2'] }))
    res = await auth(
      { id: 'id' },
      { id: 'id', groups: ['id'] } as ProjectGet,
      { id: 'id' } as WorkspaceGet
    )
    expect(res).toBe(false)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(false)

    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => ({ users: ['id2'] }))
    res = await auth(
      { id: 'id' },
      { id: 'id', groups: ['id'] } as ProjectGet,
      { id: 'id' } as WorkspaceGet
    )
    expect(res).toBe(false)

    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(false)

    // No group
    mockGroupGet.mockImplementation(() => undefined)
    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(false)

    // No organization
    mockGroupGet.mockImplementation(() => ({}))
    mockOrganizationGet.mockImplementation(() => undefined)
    res = await auth(
      { id: 'id' },
      { id: 'id' } as ProjectGet,
      { id: 'id', groups: ['id'] } as WorkspaceGet
    )
    expect(res).toBe(false)
  })

  test('checkWorkspace', async () => {
    // No workspace
    try {
      await checkWorkspaceAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(400)
      expect(err.message).toBe('Invalid workspace identifier')
    }

    // With status
    try {
      await checkWorkspaceAuth({ id: 'id' }, { id: 'id' }, 500)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid workspace identifier')
    }

    // No auth
    mockWorkspaceGet.mockImplementation(() => ({}))
    try {
      await checkWorkspaceAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(403)
      expect(err.message).toBe('Access denied')
    }

    // Auth
    mockWorkspaceGet.mockImplementation(() => ({ users: ['id'] }))
    await checkWorkspaceAuth({ id: 'id' }, { id: 'id' })
  })

  test('checkProject', async () => {
    // No project
    try {
      await checkProjectAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(400)
      expect(err.message).toBe('Invalid project identifier')
    }

    // With status
    try {
      await checkProjectAuth({ id: 'id' }, { id: 'id' }, 500)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid project identifier')
    }

    // No workspace
    mockProjectGet.mockImplementation(() => ({}))
    try {
      await checkProjectAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid workspace identifier')
    }

    // No auth
    mockWorkspaceGet.mockImplementation(() => ({}))
    try {
      await checkProjectAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(403)
      expect(err.message).toBe('Access denied')
    }

    // Auth
    mockWorkspaceGet.mockImplementation(() => ({ users: ['id'] }))
    await checkProjectAuth({ id: 'id' }, { id: 'id' })
  })

  test('checkGeometry', async () => {
    // No geometry
    try {
      await checkGeometryAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(400)
      expect(err.message).toBe('Invalid geometry identifier')
    }

    // With status
    try {
      await checkGeometryAuth({ id: 'id' }, { id: 'id' }, 500)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid geometry identifier')
    }

    // No project
    mockGeometryGet.mockImplementation(() => ({}))
    try {
      await checkGeometryAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid project identifier')
    }

    // No workspace
    mockProjectGet.mockImplementation(() => ({}))
    try {
      await checkGeometryAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid workspace identifier')
    }

    // No auth
    mockWorkspaceGet.mockImplementation(() => ({}))
    try {
      await checkGeometryAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(403)
      expect(err.message).toBe('Access denied')
    }

    // Auth
    mockWorkspaceGet.mockImplementation(() => ({ users: ['id'] }))
    await checkGeometryAuth({ id: 'id' }, { id: 'id' })
  })

  test('checkSimulation', async () => {
    // No simulation
    try {
      await checkSimulationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(400)
      expect(err.message).toBe('Invalid simulation identifier')
    }

    // With status
    try {
      await checkSimulationAuth({ id: 'id' }, { id: 'id' }, 500)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid simulation identifier')
    }

    // No project
    mockSimulationGet.mockImplementation(() => ({}))
    try {
      await checkSimulationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid project identifier')
    }

    // No workspace
    mockProjectGet.mockImplementation(() => ({}))
    try {
      await checkSimulationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid workspace identifier')
    }

    // No auth
    mockWorkspaceGet.mockImplementation(() => ({}))
    try {
      await checkSimulationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(403)
      expect(err.message).toBe('Access denied')
    }

    // Auth
    mockWorkspaceGet.mockImplementation(() => ({ users: ['id'] }))
    await checkSimulationAuth({ id: 'id' }, { id: 'id' })
  })

  test('checkOrganization', async () => {
    // No organization
    try {
      await checkOrganizationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(400)
      expect(err.message).toBe('Invalid organization identifier')
    }

    // With status
    try {
      await checkOrganizationAuth({ id: 'id' }, { id: 'id' }, 500)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(500)
      expect(err.message).toBe('Invalid organization identifier')
    }

    // No auth
    mockOrganizationGet.mockImplementation(() => ({}))
    try {
      await checkOrganizationAuth({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.status).toBe(403)
      expect(err.message).toBe('Access denied')
    }

    // Auth
    mockOrganizationGet.mockImplementation(() => ({ users: ['id'] }))
    await checkOrganizationAuth({ id: 'id' }, { id: 'id' })
  })
})
