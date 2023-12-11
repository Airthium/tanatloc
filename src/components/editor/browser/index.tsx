/** @module Components.Editor.Browser */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { FileSearchOutlined } from '@ant-design/icons'
import JSON5 from 'json5'

import { IFrontMutateUser, IFrontUser, IFrontUserModel } from '@/api/index.d'

import { setId, setModel, setTemplate } from '@/context/editor/actions'
import { EditorContext } from '@/context/editor'
import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Templates from '@/templates'

import Simulation from '@/components/project/simulation'

import UserModelAPI from '@/api/userModel'

import Utils from '@/lib/utils'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'usermodels'>
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  load: 'Unable to load current model',
  delete: 'Unable to delete model'
}

/**
 * On delete
 * @param user User
 * @param index Index
 * @param swr SWR
 */
export const _onDelete = async (
  user: Pick<IFrontUser, 'id' | 'usermodels'>,
  index: number,
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    const userModel = user.usermodels[index]
    await UserModelAPI.del({ id: userModel.id })

    // Local
    const newUser = Utils.deepCopy(user)
    newUser.usermodels = [
      ...newUser.usermodels.slice(0, index),
      ...newUser.usermodels.slice(index + 1)
    ]
    await swr.mutateUser(newUser)
  } catch (err: any) {
    dispatch(addError({ title: errors.delete, err }))
  }
}

/**
 * Browser
 * @param props Props
 * @returns Browser
 */
const Browser: React.FunctionComponent<IProps> = ({ user, swr }) => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  // Data
  const { dispatch: editorDispatch } = useContext(EditorContext)
  const { dispatch: notificationDispatch } = useContext(NotificationContext)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On ok
   * @param model Model
   */
  const onOk = useCallback(
    async (userModel: IFrontUserModel): Promise<void> => {
      try {
        // Tanatloc model
        if (!userModel.id) {
          // Get template
          const templateFile =
            Templates[userModel.model.algorithm as keyof typeof Templates]
          const res = await fetch('/templates/' + templateFile)
          const template = await res.text()
          userModel.template = template
        } else {
          delete userModel.model.userModelId
        }

        editorDispatch(setId(userModel.id))
        editorDispatch(setModel(JSON5.stringify(userModel.model, null, '\t')))
        editorDispatch(setTemplate(userModel.template))
        setVisible(false)
      } catch (err: any) {
        notificationDispatch(addError({ title: errors.load, err }))
      }
    },
    [editorDispatch, notificationDispatch]
  )

  /**
   * On delete
   * @param index Index
   */
  const onDelete = useCallback(
    async (index: number): Promise<void> => {
      await _onDelete(user, index, swr, notificationDispatch)
    },
    [user, swr, notificationDispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Simulation.Selector
        visible={visible}
        user={{
          ...user,
          authorizedplugins: []
        }}
        title="Choose simulation"
        okText="Choose"
        onCancel={setVisibleFalse}
        onOk={onOk}
        onDelete={onDelete}
      />
      <Tooltip title="Browse existing models">
        <Button
          icon={<FileSearchOutlined />}
          onClick={setVisibleTrue}
          id="browser"
        />
      </Tooltip>
    </>
  )
}

export default Browser
