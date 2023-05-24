/** @module Database.UserModel.Add */

import { IModel } from '@/models/index.d'

import { tables } from '@/config/db'

import { query } from '..'

export interface INewUserModel {
  id: string
  model: IModel
  template: string
  owners: string[]
}

/**
 * Add
 * @param userModel User model
 * @param user User
 * @return UserModel
 */
export const add = async (
  userModel: {
    model: IModel
    template: string
  },
  user: { id: string }
) => {
  const response = await query(
    'INSERT INTO ' +
      tables.MODELS +
      ' (model, template, owners) VALUES ($1, $2, $3) RETURNING id',
    [userModel.model, userModel.template, [user.id]]
  )

  const newUserModel = response.rows[0]
  newUserModel && (newUserModel.model = userModel.model)
  newUserModel && (newUserModel.template = userModel.template)
  newUserModel && (newUserModel.owners = [user.id])

  return newUserModel
}
