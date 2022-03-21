/** @module Components.Assets.Share */

import PropTypes from 'prop-types'
import {
  useState,
  useEffect,
  CSSProperties,
  Dispatch,
  SetStateAction
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

import {
  IOrganizationWithData,
  IProjectWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'
import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace?: IWorkspaceWithData
  project?: IProjectWithData
  organizations: IOrganizationWithData[]
  swr: {
    mutateOneWorkspace?: (workspace: IWorkspaceWithData) => void
    mutateOneProject?: (project: IProjectWithData) => void
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
 * @param selected Selected
 * @param swr SWR
 */
export const onShare = async (
  workspace: IProps['workspace'],
  project: IProps['project'],
  selected: { value: string }[],
  swr: IProps['swr']
): Promise<void> => {
  try {
    // Check groups
    const groups = selected
      .map(({ value }) => {
        const [type, id] = value.split('&')
        if (type === 'group') return id
      })
      .filter((g) => g)

    // Check users
    const users = selected
      .map(({ value }) => {
        const [type, id] = value.split('&')
        if (type === 'user') return id
      })
      .filter((u) => u)

    if (workspace) {
      // API
      await WorkspaceAPI.update({ id: workspace.id }, [
        {
          key: 'groups',
          value: groups
        },
        {
          key: 'users',
          value: users
        }
      ])
      // Mutate
      const newWorkspace = { ...workspace }
      newWorkspace.groups = groups.map((g) => ({ id: g }))
      newWorkspace.users = users.map((u) => ({ id: u }))
      swr.mutateOneWorkspace(newWorkspace)
    } else {
      // API
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'groups',
          value: groups
        },
        {
          key: 'users',
          value: users
        }
      ])
      // Mutate
      const newProject = { ...project }
      newProject.groups = groups.map((g) => ({ id: g }))
      newProject.users = users.map((u) => ({ id: u }))
      swr.mutateOneProject(newProject)
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
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [treeData, setTreeData]: [
    TreeDataNode[],
    Dispatch<SetStateAction<TreeDataNode[]>>
  ] = useState([])
  const [selected, setSelected]: [
    { value: string }[],
    Dispatch<SetStateAction<{ value: string }[]>>
  ] = useState([])

  // Effect
  useEffect(() => {
    const parent = workspace || project

    const defaultGroups = parent.groups.map((g) => ({ value: 'group&' + g.id }))
    const defaultUsers = parent.users.map((u) => ({ value: 'user&' + u.id }))

    setSelected([...defaultGroups, ...defaultUsers])
  }, [workspace, project])

  useEffect(() => {
    // Tree data
    const data = organizations.map((organization) => {
      const groups = organization.groups?.map((group) => {
        const users = group.users?.map((user) => {
          const title =
            user.lastname || user.firstname
              ? user.lastname + ' ' + user.firstname
              : user.email
          return {
            key: 'user&' + user.id,
            title,
            value: 'user&' + user.id,
            type: 'user'
          }
        })

        return {
          key: 'group&' + group.id,
          title: group.name,
          value: 'group&' + group.id,
          children: users,
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

    setTreeData(data)
  }, [organizations])

  let selector = null
  if (treeData?.length)
    selector = (
      <Form.Item
        label={
          <>
            Share this {workspace ? 'workspace' : 'project'} with organization
            groups or users
          </>
        }
      >
        <TreeSelect
          multiple
          placeholder="Select groups or users"
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          className="full-width"
          treeData={treeData}
          treeDefaultExpandAll
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          treeCheckStrictly
          value={selected}
          onChange={(value) => setSelected(value)}
        />
      </Form.Item>
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
          You can create organizations and groups in the Organization menu.
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
            await onShare(workspace, project, selected, swr)

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
        <Typography.Text strong>
          {workspace ? 'Workspace: ' : 'Project: '}
          {workspace?.name || project?.title}
        </Typography.Text>
        {selector}
      </Dialog>
    </>
  )
}

Share.propTypes = {
  disabled: PropTypes.bool,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    groups: PropTypes.array,
    users: PropTypes.array
  }),
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    groups: PropTypes.array,
    users: PropTypes.array
  }),
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          users: PropTypes.array
        })
      )
    })
  ).isRequired,
  swr: PropTypes.exact({
    mutateOneProject: PropTypes.func,
    mutateOneWorkspace: PropTypes.func
  }).isRequired
}

export default Share
