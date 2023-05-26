/** @module API.UserModel.Add */

import { IModel } from '@/models/index.d'
import { IFrontNewUserModel } from '../index.d'

import { call } from '@/api/call'

export const add = async (userModel: {
  model: IModel
  template: string
}): Promise<IFrontNewUserModel> => {
  const response = await call('/api/userModel', {
    method: 'POST',
    body: JSON.stringify({ userModel })
  })

  return response.json()
}
