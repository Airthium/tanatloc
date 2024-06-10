/** @module Components.Editor.Info */

import { useContext, useEffect, useState } from 'react'
import { Avatar, Card } from 'antd'
import isElectron from 'is-electron'

import { IFrontUser, IFrontUserModel } from '@/api/index.d'

import { EditorContext } from '@/context/editor'

import Utils from '@/lib/utils'

import style from '../index.module.css'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'usermodels'>
}

/**
 * Info
 * @param props Props
 * @returns Info
 */
const Info: React.FunctionComponent<IProps> = ({ user }) => {
  // State
  const [userModel, setUserModel] = useState<IFrontUserModel>()

  // Context
  const { id } = useContext(EditorContext)

  // User model
  useEffect(() => {
    const userModel = user.usermodels.find((u) => u.id === id)
    setUserModel(userModel)
  }, [user, id])

  if (isElectron()) return <></>
  if (!userModel) return <></>
  return (
    <div className={style.info}>
      <Card size="small" title="Owners" className={style.infoCard}>
        <Avatar.Group max={{ count: 5 }}>
          {userModel.owners.map((owner) => Utils.userToAvatar(owner))}
        </Avatar.Group>
      </Card>
      {userModel.users.length ? (
        <Card size="small" title="Users" className={style.infoCard}>
          <Avatar.Group max={{ count: 5 }}>
            {userModel.users.map((user) => Utils.userToAvatar(user))}
          </Avatar.Group>
        </Card>
      ) : null}
      {userModel.groups.length ? (
        <Card size="small" title="Groups" className={style.infoCard}>
          <Avatar.Group max={{ count: 5 }}>
            {userModel.groups.map((group) => Utils.groupToAvatar(group))}
          </Avatar.Group>
        </Card>
      ) : null}
    </div>
  )
}

export default Info
