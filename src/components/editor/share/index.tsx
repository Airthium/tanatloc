/** @module Components.Editor.Share */

import { useContext, useEffect, useState } from 'react'

import {
  IFrontMutateUser,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontUserModel
} from '@/api/index.d'

import Share from '@/components/assets/share'

import { EditorContext } from '@/context/editor'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'usermodels'>
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[]
  swr: {
    mutateUser?: (user: IFrontMutateUser) => Promise<void>
  }
}

/**
 * UserModelShare
 * @param props Props
 * @returns UserModelShare
 */
const UserModelShare = ({
  user,
  organizations,
  swr
}: IProps): React.JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(true)
  const [current, setCurrent] = useState<IFrontUserModel>()

  // Context
  const { id } = useContext(EditorContext)

  // Current
  useEffect(() => {
    const userModel = user.usermodels.find((u) => u.id === id)
    if (userModel?.owners.find((owner) => owner.id === user.id))
      setDisabled(false)
    else setDisabled(true)
    setCurrent(userModel)
  }, [user, id])

  /**
   * Render
   */
  return (
    <Share
      disabled={disabled}
      userModel={current}
      organizations={organizations}
      swr={swr}
      style={{ buttonBordered: true }}
    />
  )
}

export default UserModelShare
