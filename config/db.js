/** @module config/db */

/**
 * Database configuration
 */
module.exports = {
  ADMIN:
    process.env.DB_ADMIN ||
    (process.platform === 'darwin' ? process.env.USER : 'postgres'),
  ADMIN_DATABASE: process.env.DB_ADMIN_DATABASE || 'postgres',
  ADMIN_PASSWORD: process.env.DB_ADMIN_PASSWORD || '',
  USER: process.env.DB_USER || 'tanatlocuser',
  HOST: process.env.DB_HOST || 'localhost',
  PORT: process.env.DB_PORT || 5432,
  DATABASE: process.env.DB_DATABASE || 'tanatloc2',
  PASSWORD: process.env.DB_PASSWORD || 'tanatloc'
}

/**
 * Tables names
 */
const tables = {
  SYSTEM: 'tanatloc_system',
  USERS: 'tanatloc_users',
  ORGANIZATIONS: 'tanatloc_organizations',
  GROUPS: 'tanatloc_groups',
  WORKSPACES: 'tanatloc_workspaces',
  PROJECTS: 'tanatloc_projects',
  GEOMETRIES: 'tanatloc_geometries',
  SIMULATIONS: 'tanatloc_simulations',
  AVATARS: 'tanatloc_avatars',
  TASKS: 'tanatloc_tasks',
  LINKS: 'tanatloc_links'
}

const schemas = {
  [tables.SYSTEM]: [
    {
      name: 'allowsignup',
      type: 'BOOLEAN',
      constraint: 'NOT NULL'
    },
    {
      name: 'password',
      type: 'JSONB'
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
      name: 'users',
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
      name: 'json',
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
      type: 'JSONB'
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
  ]
}

module.exports.tables = tables
module.exports.schemas = schemas
