/** @module API.UserModel.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '../call'

export const update = async (
  userModel: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/userModel', {
    method: 'PUT',
    body: JSON.stringify({ userModel, data })
  })
}
