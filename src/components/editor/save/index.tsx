/** @module Components.Editor.Save */

import { Dispatch, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Modal, Tooltip } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'
import { IFrontMutateUser, IFrontUser, IFrontUserModel } from '@/api/index.d'

import { EditorContext, IEditorAction } from '@/context/editor'
import { setId } from '@/context/editor/actions'

import { ErrorNotification } from '@/components/assets/notification'

import UserModelAPI from '@/api/userModel'

import Utils from '@/lib/utils'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'usermodels'>
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
 * @param swr SWR
 * @param model Model
 * @param template Template
 * @param disptach Dispatch
 */
export const _onSave = async (
  user: Pick<IFrontUser, 'id' | 'usermodels'>,
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
  },
  model: string,
  template: string,
  dispatch: Dispatch<IEditorAction>
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
    const usermodel = user.usermodels.find(
      (usermodel) => usermodel.model.algorithm === modelJSON.algorithm
    )
    if (usermodel) {
      // Check owner
      if (usermodel.owners.find((owner) => owner.id === user.id)) {
        Modal.confirm({
          title:
            'A model with the same algorithm entry already exists. Do you want to override it?',
          onOk: async () => {
            await _save(user, swr, usermodel, dispatch)
          }
        })
      } else {
        Modal.confirm({
          title:
            'You are not the owner of this algoirhtm. Do you want to create a new one in your account?',
          onOk: async () => {
            await _save(
              user,
              swr,
              { id: '0', model: usermodel.model, template: usermodel.template },
              dispatch
            )
          }
        })
      }
    } else {
      await _save(user, swr, { id: '0', model: modelJSON, template }, dispatch)
    }
  } catch (err: any) {
    ErrorNotification(errors.check, err)
  }
}

/**
 * Save
 * @param user User
 * @param swr SWR
 * @param usermodel User model
 * @param dispatch Dispatch
 */
export const _save = async (
  user: Pick<IFrontUser, 'id' | 'usermodels'>,
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
  },
  usermodel: Pick<IFrontUserModel, 'id' | 'model' | 'template'>,
  dispatch: Dispatch<IEditorAction>
): Promise<void> => {
  // Add user
  if (usermodel.id === '0') {
    // Add
    try {
      const newUserModel = await UserModelAPI.add({
        model: usermodel.model,
        template: usermodel.template
      })

      // Local
      dispatch(setId(newUserModel.id))
      const newUser = Utils.deepCopy(user)
      newUser.usermodels.push({
        ...newUserModel,
        owners: [user],
        groups: [],
        users: []
      } as IFrontUserModel)
      await swr.mutateUser(newUser)
    } catch (err: any) {
      ErrorNotification(errors.save, err)
    }
  } else {
    // Replace
    try {
      await UserModelAPI.update({ id: usermodel.id }, [
        {
          key: 'model',
          value: usermodel.model
        },
        {
          key: 'template',
          value: usermodel.template
        }
      ])

      // Local
      const newUser = Utils.deepCopy(user)
      const index = newUser.usermodels.findIndex((u) => u.id === usermodel.id)
      newUser.usermodels[index] = {
        ...newUser.usermodels[index],
        model: usermodel.model,
        template: usermodel.template
      }
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
const Save = ({ user, swr }: IProps): React.JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { model, template, templateValid, modelValid, dispatch } =
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
      await _onSave(user, swr, model, template, dispatch)
      setLoading(false)
    })()
  }, [user, model, template, swr, dispatch])

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
