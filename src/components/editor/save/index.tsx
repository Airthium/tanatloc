/** @module Components.Editor.Save */

import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Modal, Tooltip } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'
import { IFrontMutateUser, IFrontUser } from '@/api/index.d'

import { EditorContext } from '@/context/editor'

import { ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

import Utils from '@/lib/utils'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'models'>
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  json: 'Model definition is not valid',
  check: 'Unable to check',
  save: 'Unable to save'
}

/**
 * On save
 * @param user User
 * @param model Model
 * @param template Template
 */
export const _onSave = async (
  user: Pick<IFrontUser, 'id' | 'models'>,
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
  },
  model: string,
  template: string
): Promise<void> => {
  let modelJSON: IModel
  try {
    modelJSON = JSON.parse(model)
  } catch (err: any) {
    ErrorNotification(errors.json, err)
    return
  }

  try {
    // Check existing model
    const existing = user.models.find(
      (m) => m.algorithm === modelJSON.algorithm
    )
    if (existing) {
      Modal.confirm({
        title:
          'A model with the same algorithm entry already exists. Do you want to override it?',
        onOk: async () => {
          // Index
          const index = user.models.findIndex(
            (m) => m.algorithm === modelJSON.algorithm
          )
          await _save(user, swr, modelJSON, template, index)
        }
      })
    } else {
      await _save(user, swr, modelJSON, template)
    }
  } catch (err: any) {
    ErrorNotification(errors.check, err)
  }
}

/**
 * Save
 * @param model Model
 * @param template Template
 */
export const _save = async (
  user: Pick<IFrontUser, 'id' | 'models'>,
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
  },
  model: IModel,
  template: string,
  index?: number
): Promise<void> => {
  if (index === undefined) {
    // Add
    try {
      // API
      await UserAPI.update([
        {
          key: 'models',
          type: 'array',
          method: 'append',
          value: {
            ...model,
            user: user.id
          }
        },
        {
          key: 'templates',
          type: 'array',
          method: 'append',
          value: template
        }
      ])

      // Local
      const newUser = Utils.deepCopy(user)
      newUser.models.push(model)
      await swr.mutateUser(newUser)
    } catch (err: any) {
      ErrorNotification(errors.save, err)
    }
  } else {
    // Replace
    try {
      // API
      await UserAPI.update([
        {
          key: 'models',
          type: 'array',
          method: 'set',
          index: index,
          value: {
            ...model,
            user: user.id
          }
        },
        {
          key: 'templates',
          type: 'array',
          method: 'set',
          index: index,
          value: template
        }
      ])

      // Local
      const newUser = Utils.deepCopy(user)
      newUser.models[index] = model
      await swr.mutateUser(newUser)
    } catch (err: any) {
      ErrorNotification(errors.save, err)
    }
  }
}

/**
 * Save
 * @param props Props
 * @returns Save
 */
const Save = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { model, template, templateValid, modelValid } =
    useContext(EditorContext)

  // Valid
  useEffect(() => {
    if (templateValid && modelValid) setDisabled(false)
    else setDisabled(true)
  }, [templateValid, modelValid])

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      await _onSave(user, swr, model, template)
      setLoading(false)
    })()
  }, [user, model, template, swr])

  /**
   * Render
   */
  return (
    <Tooltip title="Save">
      <Button
        disabled={disabled}
        loading={loading}
        icon={<SaveOutlined />}
        onClick={onClick}
        id="save"
      />
    </Tooltip>
  )
}

export default Save
