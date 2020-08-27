import { update as updatedB } from '../database/workspace'

const add = async () => {}

const get = async () => {}

const update = async ({ workspace: { id }, data }) => {
  await updatedB({ workspace: { id }, data })
}

const del = async () => {}

export { add, get, update, del }
