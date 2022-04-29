/** @module Components.Assets.Share */

import { useRouter } from 'next/router'
import { useState, useEffect, CSSProperties } from 'react'
import {
  Button,
  Form,
  Tooltip,
  TreeDataNode,
  TreeSelect,
  Typography
} from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import { LinkButton } from '../button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontOrganizationsItem,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'
import ProjectAPI from '@/api/project'
import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace?: Pick<IFrontWorkspacesItem, 'id' | 'name' | 'users' | 'groups'>
  project?: Pick<IFrontProjectsItem, 'id' | 'title' | 'users' | 'groups'>
  organizations: Pick<IFrontOrganizationsItem, 'id' | 'name' | 'groups'>[]
  swr: {
    mutateOneWorkspace?: (workspace: IFrontMutateWorkspacesItem) => void
    mutateOneProject?: (project: IFrontMutateProjectsItem) => void
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
export const onShare = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'users' | 'groups'> | undefined,
  project: Pick<IFrontProjectsItem, 'id' | 'users' | 'groups'> | undefined,
  groupsSelected: string[],
  usersSelected: string[],
  swr: IProps['swr']
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
      swr.mutateOneWorkspace!(newWorkspace)
    } else {
      // API
      await ProjectAPI.update({ id: project!.id }, [
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
      const newProject = Utils.deepCopy(project!)
      newProject.groups = groupsSelected.map(
        (group) => ({ id: group } as IFrontProjectsItem['groups'][0])
      )
      newProject.users = usersSelected.map(
        (user) => ({ id: user } as IFrontProjectsItem['users'][0])
      )
      swr.mutateOneProject!(newProject)
    }
  } catch (err) {
    ErrorNotification(errors.share, err)
    throw err
  }
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
  organizations,
  swr,
  style
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [treeGroupsData, setTreeGroupsData] = useState<TreeDataNode[]>([])
  const [treeUsersData, setTreeUsersData] = useState<TreeDataNode[]>([])
  const [groupsSelected, setGroupsSelected] = useState<string[]>([])
  const [usersSelected, setUsersSelected] = useState<string[]>([])

  // Data
  const router = useRouter()

  // Effect
  useEffect(() => {
    const parent = workspace || project

    const defaultGroups = parent?.groups?.map((g) => g.id)
    const defaultUsers = parent?.users?.map((u) => u.id)

    setGroupsSelected(defaultGroups as string[])
    setUsersSelected(defaultUsers as string[])
  }, [workspace, project])

  useEffect(() => {
    // Tree data
    const groupsData = organizations.map((organization) => {
      const groups = organization.groups?.map((group) => {
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

    const usersData = organizations
      .map((organization) => {
        return organization.groups
          ?.map((group) => {
            return group.users?.map((user) => {
              let title = user.email
              if (user.lastname || user.firstname) {
                title = user.lastname ? user.lastname + ' ' : ''
                title += user.firstname || ''
              }
              return {
                key: user.id,
                title,
                value: user.id,
                type: 'user'
              }
            })
          })
          .flatMap((g) => g)
      })
      .flatMap((o) => o)
      .filter((o) => o)

    const uniqueUsersData = usersData.filter(
      (user, index, self) =>
        self.findIndex((s) => s?.key === user?.key) === index
    )

    setTreeGroupsData(groupsData)
    setTreeUsersData(uniqueUsersData as TreeDataNode[])
  }, [organizations])

  let selector = null
  if (treeGroupsData?.length)
    selector = (
      <>
        <Form.Item
          label={
            <>
              Share this {workspace ? 'workspace' : 'project'} with
              organizations groups
            </>
          }
        >
          <TreeSelect
            multiple
            treeCheckable
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            placeholder="Select groups"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            className="full-width"
            treeData={treeGroupsData}
            value={groupsSelected}
            onChange={(value) => setGroupsSelected(value)}
          />
        </Form.Item>
        <Form.Item
          label={
            <>
              Share this {workspace ? 'workspace' : 'project'} with
              organizations users
            </>
          }
        >
          <TreeSelect
            multiple
            treeCheckable
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            placeholder="Select users"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            className="full-width"
            treeData={treeUsersData}
            value={usersSelected}
            onChange={(value) => setUsersSelected(value)}
          />
        </Form.Item>
      </>
    )
  else
    selector = (
      <>
        <br />
        <Typography.Text strong>
          There is no organization for now
        </Typography.Text>
        <br />
        <Typography.Text>
          You can create organizations and groups in the{' '}
          <LinkButton
            onClick={() =>
              router.push({
                pathname: '/dashboard',
                query: { page: 'organizations' }
              })
            }
          >
            Organization menu
          </LinkButton>
          .
        </Typography.Text>
      </>
    )

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Share">
        <Button
          className={
            'no-background ' +
            (style?.buttonLight ? 'text-light ' : '') +
            (style?.buttonDark ? ' text-dark ' : '') +
            (style?.buttonBordered ? ' ' : 'no-border ')
          }
          key="share"
          disabled={disabled}
          icon={<ShareAltOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
      <Dialog
        title={'Share ' + (workspace ? 'workspace' : 'project')}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async () => {
          setLoading(true)
          try {
            await onShare(
              workspace,
              project,
              groupsSelected,
              usersSelected,
              swr
            )

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
        loading={loading}
      >
        <Typography.Title level={5}>
          {workspace ? 'Workspace: ' : 'Project: '}
          {workspace?.name || project?.title}
        </Typography.Title>
        {selector}
      </Dialog>
    </>
  )
}

export default Share
