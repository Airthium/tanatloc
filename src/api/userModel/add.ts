/** @module API.UserModel.Add */

import { IModel } from '@/models/index.d'
import { IFrontUserModel } from '../index.d'

import { call } from '@/api/call'

export const add = async (userModel: {
  model: IModel
  template: string
}): Promise<IFrontUserModel> => {
  const response = await call('/api/userModel', {
    method: 'POST',
    body: JSON.stringify({ userModel })
  })

  return response.json()
}
