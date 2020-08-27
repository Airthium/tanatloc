import { update as updatedB } from '../database/workspace'

const update = async ({ workspace: { id }, data }) => {
  await updatedB({ workspace: { id }, data })
}

export { update }
