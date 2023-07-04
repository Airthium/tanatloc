/** @module Components.Assets.Share */

import { useRouter } from 'next/router'
import {
  useState,
  useEffect,
  CSSProperties,
  useMemo,
  useCallback,
  Dispatch,
  useContext
} from 'react'
import {
  Button,
  Form,
  Tooltip,
  TreeDataNode,
  TreeSelect,
  Typography
} from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import isElectron from 'is-electron'

import {
  IFrontMutateProjectsItem,
  IFrontMutateUser,
  IFrontMutateWorkspacesItem,
  IFrontOrganizationsItem,
  IFrontProjectsItem,
  IFrontUserModel,
  IFrontWorkspacesItem
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { LinkButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import Utils from '@/lib/utils'

import ProjectAPI from '@/api/project'
import WorkspaceAPI from '@/api/workspace'
import UserModelAPI from '@/api/userModel'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace?: Pick<IFrontWorkspacesItem, 'id' | 'name' | 'users' | 'groups'>
  project?: Pick<IFrontProjectsItem, 'id' | 'title' | 'users' | 'groups'>
  userModel?: Pick<IFrontUserModel, 'id' | 'model' | 'users' | 'groups'>
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[]
  swr: {
    mutateUser?: (user: IFrontMutateUser) => Promise<void>
    mutateOneWorkspace?: (
      workspace: IFrontMutateWorkspacesItem
    ) => Promise<void>
    mutateOneProject?: (project: IFrontMutateProjectsItem) => Promise<void>
  }
  style?: CSSProperties & {
    buttonLight?: boolean
    buttonDark?: boolean
    buttonBordered?: boolean
  }
}

/**
 * Errors
 */
export const errors = {
  share: 'Unable to share'
}

/**
 * On share
 * @param workspace Workspace
 * @param project Project
 * @param groupsSelected Groups selected
 * @param usersSelected User selected
 * @param swr SWR
 */
export const _onShare = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'users' | 'groups'> | undefined,
  project: Pick<IFrontProjectsItem, 'id' | 'users' | 'groups'> | undefined,
  userModel:
    | Pick<IFrontUserModel, 'id' | 'model' | 'users' | 'groups'>
    | undefined,
  groupsSelected: string[],
  usersSelected: string[],
  swr: IProps['swr'],
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    if (workspace) {
      // API
      await WorkspaceAPI.update({ id: workspace.id }, [
        {
          key: 'groups',
          value: groupsSelected
        },
        {
          key: 'users',
          value: usersSelected
        }
      ])
      // Mutate
      const newWorkspace = Utils.deepCopy(workspace)
      newWorkspace.groups = groupsSelected.map(
        (group) =>
          ({
            id: group
          } as IFrontWorkspacesItem['groups'][0])
      )
      newWorkspace.users = usersSelected.map(
        (user) => ({ id: user } as IFrontWorkspacesItem['users'][0])
      )
      await swr.mutateOneWorkspace!(newWorkspace)
    } else if (project) {
      // API
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'groups',
          value: groupsSelected
        },
        {
          key: 'users',
          value: usersSelected
        }
      ])
      // Mutate
      const newProject = Utils.deepCopy(project)
      newProject.groups = groupsSelected.map(
        (group) => ({ id: group } as IFrontProjectsItem['groups'][0])
      )
      newProject.users = usersSelected.map(
        (user) => ({ id: user } as IFrontProjectsItem['users'][0])
      )
      await swr.mutateOneProject!(newProject)
    } else {
      // API
      await UserModelAPI.update({ id: userModel!.id }, [
        {
          key: 'groups',
          value: groupsSelected
        },
        {
          key: 'users',
          value: usersSelected
        }
      ])

      // Mutate
      const newUserModel = Utils.deepCopy(userModel!)
      newUserModel.groups = groupsSelected.map(
        (group) => ({ id: group } as IFrontUserModel['groups'][0])
      )
      newUserModel.users = usersSelected.map(
        (user) => ({ id: user } as IFrontUserModel['users'][0])
      )
      await swr.mutateUser!(newUserModel)
    }
  } catch (err: any) {
    dispatch(addError({ title: errors.share, err }))
    throw err
  }
}

/**
 * User title
 * @param user User
 * @returns Title
 */
export const _userTitle = (user: {
  email: string
  lastname?: string
  firstname?: string
}): string => {
  let title = user.email
  if (user.lastname || user.firstname) {
    title = user.lastname ? user.lastname + ' ' : ''
    title += user.firstname ?? ''
  }
  return title
}

/**
 * Share
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - workspace (Object) Workspace
 * - project (Object) Project
 * - organizations (Array) Organizations
 * - swr (Object) SWR functions
 * - style (Object) Button style
 * @returns Share
 */
const Share = ({
  disabled,
  workspace,
  project,
  userModel,
  organizations,
  swr,
  style
}: IProps): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [treeGroupsData, setTreeGroupsData] = useState<TreeDataNode[]>([])
  const [treeUsersData, setTreeUsersData] = useState<TreeDataNode[]>([])
  const [groupsSelected, setGroupsSelected] = useState<string[]>([])
  const [usersSelected, setUsersSelected] = useState<string[]>([])

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()

  // Effect
  useEffect(() => {
    const parent = workspace ?? project ?? userModel

    const defaultGroups = parent?.groups.map((g: { id: string }) => g.id)
    const defaultUsers = parent?.users.map((u: { id: string }) => u.id)

    setGroupsSelected(defaultGroups ?? [])
    setUsersSelected(defaultUsers ?? [])
  }, [workspace, project, userModel])

  useEffect(() => {
    // Tree data
    const groupsData = organizations.map((organization) => {
      const groups = organization.groups.map((group) => {
        return {
          key: group.id,
          title: group.name,
          value: group.id,
          type: 'group'
        }
      })

      return {
        key: organization.id,
        title: organization.name,
        value: organization.id,
        disabled: true,
        checkable: false,
        children: groups
      }
    })

    const users: { key: string; title: string; value: string; type: 'user' }[] =
      []
    organizations.forEach((organization) => {
      organization.owners.forEach((owner) => {
        users.push({
          key: owner.id,
          title: _userTitle(owner),
          value: owner.id,
          type: 'user'
        })
      })
      organization.users.forEach((user) => {
        users.push({
          key: user.id,
          title: _userTitle(user),
          value: user.id,
          type: 'user'
        })
      })
      organization.groups.forEach((group) => {
        group.users.forEach((user) => {
          users.push({
            key: user.id,
            title: _userTitle(user),
            value: user.id,
            type: 'user'
          })
        })
      })
    })

    const uniqueUsersData = users.filter(
      (user, index, self) => self.findIndex((s) => s.key === user.key) === index
    )

    setTreeGroupsData(groupsData)
    setTreeUsersData(uniqueUsersData as TreeDataNode[])
  }, [organizations])

  /**
   * Dashboard
   */
  const dashboard = useCallback((): void => {
    ;(async () => {
      await router.push({
        pathname: '/dashboard',
        query: { page: 'organizations' }
      })
    })()
  }, [router])

  /**
   * Groups title
   */
  const groupsTitle = useMemo(() => {
    let title = 'Share this '
    if (workspace) title += 'workspace'
    else if (project) title += 'project'
    else title += 'user model'
    title += ' with organizations groups'

    return title
  }, [workspace, project])

  /**
   * Users title
   */
  const usersTitle = useMemo(() => {
    let title = 'Share this '
    if (workspace) title += 'workspace'
    else if (project) title += 'project'
    else title += 'user model'
    title += ' with organizations users'

    return title
  }, [workspace, project])

  // Selector
  const selector = useMemo(() => {
    if (treeGroupsData.length)
      return (
        <>
          <Form.Item label={<>{groupsTitle}</>}>
            <TreeSelect
              multiple
              treeCheckable
              treeDefaultExpandAll
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              placeholder="Select groups"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              className={globalStyle.fullWidth}
              treeData={treeGroupsData}
              value={groupsSelected}
              onChange={setGroupsSelected}
            />
          </Form.Item>
          <Form.Item label={<>{usersTitle}</>}>
            <TreeSelect
              multiple
              treeCheckable
              treeDefaultExpandAll
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              placeholder="Select users"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              className={globalStyle.fullWidth}
              treeData={treeUsersData}
              value={usersSelected}
              onChange={setUsersSelected}
            />
          </Form.Item>
        </>
      )
    else
      return (
        <>
          <br />
          <Typography.Text strong>
            There is no organization for now
          </Typography.Text>
          <br />
          <Typography.Text>
            You can create organizations and groups in the{' '}
            <LinkButton onClick={dashboard}>Organization menu</LinkButton>.
          </Typography.Text>
        </>
      )
  }, [
    groupsTitle,
    usersTitle,
    treeGroupsData,
    treeUsersData,
    groupsSelected,
    usersSelected,
    dashboard
  ])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * On ok
   */
  const onOk = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onShare(
        workspace,
        project,
        userModel,
        groupsSelected,
        usersSelected,
        swr,
        dispatch
      )

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [
    workspace,
    project,
    userModel,
    groupsSelected,
    usersSelected,
    swr,
    dispatch
  ])

  /**
   * Title
   */
  const title = useMemo(() => {
    let title = 'Share '
    if (workspace) title += 'workspace'
    else if (project) title += 'project'
    else title += 'user model'

    return title
  }, [workspace, project])

  /**
   * Description
   */
  const description = useMemo(() => {
    let description = ''
    if (workspace) description += 'Workspace'
    else if (project) description += 'Project'
    else description += 'User model'

    description += ': '

    if (workspace) description += workspace.name
    else if (project) description += project.title
    else description += userModel?.model.name

    return description
  }, [workspace, project, userModel])

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Share">
        <Button
          className={`${globalStyle.noBackground} ${
            style?.buttonLight ? globalStyle.textLight : ''
          } ${style?.buttonDark ? globalStyle.textDark : ''} ${
            style?.buttonBordered ? '' : globalStyle.noBorder
          } ${isElectron() ? globalStyle.displayNone : ''}`}
          key="share"
          id={'share'}
          disabled={disabled}
          type={disabled && !style?.buttonBordered ? 'link' : undefined}
          icon={<ShareAltOutlined />}
          onClick={setVisibleTrue}
        />
      </Tooltip>
      <Dialog
        title={title}
        visible={visible}
        onCancel={setVisibleFalse}
        onOk={onOk}
        loading={loading}
      >
        <Typography.Title level={5}>{description}</Typography.Title>
        {selector}
      </Dialog>
    </>
  )
}

export default Share
