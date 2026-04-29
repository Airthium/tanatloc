if (typeof window !== 'undefined') window.React = require('react')

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))
