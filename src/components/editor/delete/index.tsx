/** @module Components.Editor.Delete */

import { IFrontMutateUser, IFrontUser } from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import { DeleteButton } from '@/components/assets/button'

import UserAPI from '@/api/user'

import Utils from '@/lib/utils'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'models' | 'templates'>
  index: number
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => void
  }
}

/**
 * Errors
 */
export const errors = {
  delete: 'Unable to delete model'
}

/**
 * On delete
 * @param user User
 * @param index Index
 * @param swr SWR
 */
export const onDelete = async (
  user: Pick<IFrontUser, 'id' | 'models' | 'templates'>,
  index: number,
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => void
  }
) => {
  try {
    const model = user.models[index]
    const template = user.templates[index]

    // API
    await UserAPI.update([
      {
        key: 'models',
        type: 'array',
        method: 'remove',
        value: model
      },
      {
        key: 'templates',
        type: 'array',
        method: 'remove',
        value: template
      }
    ])

    // Local
    const newUser = Utils.deepCopy(user)
    newUser.models = [
      ...newUser.models.slice(0, index),
      ...newUser.models.slice(index + 1)
    ]
    newUser.templates = [
      ...newUser.templates.slice(0, index),
      ...newUser.templates.slice(index + 1)
    ]
    swr.mutateUser(newUser)
  } catch (err) {
    ErrorNotification(errors.delete, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ user, index, swr }: IProps): JSX.Element => {
  /**
   * Render
   */
  return <DeleteButton onDelete={async () => onDelete(user, index, swr)} />
}

export default Delete
