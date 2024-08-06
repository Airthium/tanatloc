/** @module Config.Database */

// Database configuration
/**
 * Admin
 *
 * Set by `DB_ADMIN` environment variable or:
 * - `darwin` on MacOS
 * - `postrges` on Unix-like systems and Windows
 */
export const ADMIN: string =
  process.env.DB_ADMIN ??
  (process.platform === 'darwin'
    ? (process.env.USER ?? 'postgres')
    : 'postgres')

/**
 * Admin database
 *
 * Set by `DB_ADMIN_DATABASE` environment variable or `postgres`
 */
export const ADMIN_DATABASE: string =
  process.env.DB_ADMIN_DATABASE ?? 'postgres'

/**
 * Admin password
 *
 * Set by `DB_ADMIN_PASSWORD` or empty string
 */
export const ADMIN_PASSWORD: string =
  process.env.DB_ADMIN_PASSWORD ?? 'password'

/**
 * User
 *
 * Set by `DB_USER` environment variable or `tanatlocuser`
 */
export const USER: string = process.env.DB_USER ?? 'tanatlocuser'

/**
 * Schema
 *
 * Schema name
 */
export const SCHEMA: string = 'TANATLOCSCHEMA'

/**
 * Host
 *
 * Set by `DB_HOST` environment variable or `localhost`
 */
export const HOST: string = process.env.DB_HOST ?? 'localhost'

/**
 * Port
 *
 * Set by `DB_PORT` environment variable or `5432`
 */
export const PORT: number = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : 5432

/**
 * Database
 *
 * Set by `DB_DATABASE` environment variable or `tanatloc2`
 */
export const DATABASE: string = process.env.DB_DATABASE ?? 'tanatloc2'

/**
 * Password
 *
 * Set by `DB_PASSWORD` environment variable or `tanatloc`
 */
export const PASSWORD: string = process.env.DB_PASSWORD ?? 'tanatloc'

export interface Tables {
  SECURITY: string
  SYSTEM: string
  USERS: string
  ORGANIZATIONS: string
  GROUPS: string
  WORKSPACES: string
  PROJECTS: string
  GEOMETRIES: string
  SIMULATIONS: string
  AVATARS: string
  LINKS: string
  MODELS: string
}

/**
 * Tables names
 */
export const tables: Tables = {
  SECURITY: 'tanatloc_security',
  SYSTEM: 'tanatloc_system',
  USERS: 'tanatloc_users',
  ORGANIZATIONS: 'tanatloc_organizations',
  GROUPS: 'tanatloc_groups',
  WORKSPACES: 'tanatloc_workspaces',
  PROJECTS: 'tanatloc_projects',
  GEOMETRIES: 'tanatloc_geometries',
  SIMULATIONS: 'tanatloc_simulations',
  AVATARS: 'tanatloc_avatars',
  LINKS: 'tanatloc_links',
  MODELS: 'tanatloc_models'
}

export interface Scheme {
  [key: string]: {
    name: string
    type: string
    constraint?: string
    default?: string
  }[]
}

/**
 * Tables schemes
 */
export const schemas: Scheme = {
  [tables.SECURITY]: [
    {
      name: 'encrypt_pass',
      type: 'TEXT',
      constraint: 'NOT NULL'
    }
  ],
  [tables.SYSTEM]: [
    {
      name: 'allowsignup',
      type: 'BOOLEAN',
      constraint: 'NOT NULL'
    },
    {
      name: 'password',
      type: 'JSONB'
    },
    {
      name: 'defaultplugins',
      type: 'TEXT[]'
    }
  ],
  [tables.AVATARS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'path',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'type',
      type: 'TEXT',
      constraint: 'NOT NULL'
    }
  ],
  [tables.USERS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'lastname',
      type: 'TEXT'
    },
    {
      name: 'firstname',
      type: 'TEXT'
    },
    {
      name: 'email',
      type: 'TEXT',
      constraint: 'NOT NULL UNIQUE'
    },
    {
      name: 'avatar',
      type: 'UUID',
      constraint: 'REFERENCES ' + tables.AVATARS + ' (id) ON DELETE SET NULL'
    },
    {
      name: 'isvalidated',
      type: 'BOOLEAN',
      constraint: 'NOT NULL'
    },
    {
      name: 'lastmodificationdate',
      type: 'TIMESTAMP',
      constraint: 'NOT NULL'
    },
    {
      name: 'superuser',
      type: 'BOOLEAN',
      constraint: 'NOT NULL'
    },
    {
      name: 'password',
      type: 'TEXT'
    },
    {
      name: 'passwordlastchanged',
      type: 'TIMESTAMP'
    },
    {
      name: 'organizations',
      type: 'UUID[]'
    },
    {
      name: 'workspaces',
      type: 'UUID[]'
    },
    {
      name: 'projects',
      type: 'UUID[]'
    },
    {
      name: 'usermodels',
      type: 'UUID[]'
    },
    {
      name: 'models', // TODOLATER remove
      type: 'JSONB[]'
    },
    {
      name: 'templates', // TODOLATER remove
      type: 'TEXT[]'
    },
    {
      name: 'authorizedplugins',
      type: 'TEXT[]'
    },
    {
      name: 'plugins',
      type: 'JSONB[]'
    }
  ],
  [tables.ORGANIZATIONS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'owners',
      type: 'UUID[]',
      constraint: 'NOT NULL'
    },
    {
      name: 'pendingowners',
      type: 'UUID[]'
    },
    {
      name: 'users',
      type: 'UUID[]'
    },
    {
      name: 'pendingusers',
      type: 'UUID[]'
    },
    {
      name: 'groups',
      type: 'UUID[]'
    }
  ],
  [tables.GROUPS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'users',
      type: 'UUID[]',
      constraint: 'NOT NULL'
    },
    {
      name: 'workspaces',
      type: 'UUID[]'
    },
    {
      name: 'projects',
      type: 'UUID[]'
    },
    {
      name: 'usermodels',
      type: 'UUID[]'
    },
    {
      name: 'organization',
      type: 'UUID',
      constraint: 'NOT NULL'
    }
  ],
  [tables.WORKSPACES]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'owners',
      type: 'UUID[]',
      constraint: 'NOT NULL'
    },
    {
      name: 'users',
      type: 'UUID[]'
    },
    {
      name: 'groups',
      type: 'UUID[]'
    },
    {
      name: 'projects',
      type: 'UUID[]'
    },
    {
      name: 'archivedprojects',
      type: 'JSONB[]'
    }
  ],
  [tables.PROJECTS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'archived',
      type: 'BOOLEAN'
    },
    {
      name: 'title',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'description',
      type: 'TEXT'
    },
    {
      name: 'avatar',
      type: 'UUID',
      constraint: 'REFERENCES ' + tables.AVATARS + ' (id) ON DELETE SET NULL'
    },
    {
      name: 'public',
      type: 'BOOLEAN'
    },
    {
      name: 'history',
      type: 'JSONB'
    },
    {
      name: 'createddate',
      type: 'TIMESTAMP',
      constraint: 'NOT NULL'
    },
    {
      name: 'lastaccess',
      type: 'TIMESTAMP',
      constraint: 'NOT NULL'
    },
    {
      name: 'geometries',
      type: 'UUID[]'
    },
    {
      name: 'simulations',
      type: 'UUID[]'
    },
    {
      name: 'owners',
      type: 'UUID[]',
      constraint: 'NOT NULL'
    },
    {
      name: 'users',
      type: 'UUID[]'
    },
    {
      name: 'groups',
      type: 'UUID[]'
    },
    {
      name: 'workspace',
      type: 'UUID',
      constraint: 'NOT NULL'
    }
  ],
  [tables.GEOMETRIES]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'originalfilename',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'extension',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'uploadfilename',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'glb',
      type: 'TEXT'
    },
    {
      name: 'brep',
      type: 'TEXT'
    },
    {
      name: 'summary',
      type: 'JSONB'
    },
    {
      name: 'project',
      type: 'UUID',
      constraint: 'NOT NULL'
    }
  ],
  [tables.SIMULATIONS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'name',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'scheme',
      type: 'JSONB',
      constraint: 'NOT NULL'
    },
    {
      name: 'tasks',
      type: 'JSONB[]'
    },
    {
      name: 'project',
      type: 'UUID',
      constraint: 'NOT NULL'
    }
  ],
  [tables.LINKS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'type',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'email',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'userid',
      type: 'TEXT'
    }
  ],
  [tables.MODELS]: [
    {
      name: 'id',
      type: 'UUID',
      constraint: 'PRIMARY KEY',
      default: 'DEFAULT gen_random_uuid()'
    },
    {
      name: 'model',
      type: 'JSONB',
      constraint: 'NOT NULL'
    },
    {
      name: 'template',
      type: 'TEXT',
      constraint: 'NOT NULL'
    },
    {
      name: 'owners',
      type: 'UUID[]',
      constraint: 'NOT NULL'
    },
    {
      name: 'users',
      type: 'UUID[]'
    },
    {
      name: 'groups',
      type: 'UUID[]'
    }
  ]
}
