/** @module API.Project */

import { useProjects } from './useProjects'
import { useProject } from './useProject'
import { add } from './add'
import { update } from './update'
import { del } from './del'
import { archive } from './archive'
import { unarchiveFromServer } from './unarchiveFromServer'
import { deleteArchiveFile } from './deleteArchiveFile'

export default {
  useProjects,
  useProject,
  add,
  update,
  del,
  archive,
  unarchiveFromServer,
  deleteArchiveFile
}
