/** @module Components.Editor.Browser */

import { useCallback, useContext, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { FileSearchOutlined } from '@ant-design/icons'

import { IFrontMutateUser, IFrontUser } from '@/api/index.d'
import { IModel } from '@/models/index.d'

import { setModel, setTemplate } from '@/context/editor/actions'
import { EditorContext } from '@/context/editor'

import Templates from '@/templates'

import { ErrorNotification } from '@/components/assets/notification'
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
  }
): Promise<void> => {
  try {
    const userModel = user.usermodels[index]
    await UserModelAPI.del(userModel)

    // Local
    const newUser = Utils.deepCopy(user)
    newUser.usermodels = [
      ...newUser.usermodels.slice(0, index),
      ...newUser.usermodels.slice(index + 1)
    ]
    await swr.mutateUser(newUser)
  } catch (err: any) {
    ErrorNotification(errors.delete, err)
  }
}

/**
 * Browser
 * @param props Props
 * @returns Browser
 */
const Browser = ({ user, swr }: IProps): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  // Data
  const { dispatch } = useContext(EditorContext)

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
    async (model: IModel): Promise<void> => {
      try {
        // Get template
        const templateFile =
          Templates[model.algorithm as keyof typeof Templates]
        const res = await fetch('/templates/' + templateFile)
        const template = await res.text()

        model.user && delete model.user
        dispatch(setModel(JSON.stringify(model, null, '\t')))
        dispatch(setTemplate(template))
        setVisible(false)
      } catch (err: any) {
        ErrorNotification(errors.load, err)
      }
    },
    [dispatch]
  )

  /**
   * On delete
   * @param index Index
   */
  const onDelete = useCallback(
    async (index: number): Promise<void> => {
      await _onDelete(user, index, swr)
    },
    [user, swr]
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
