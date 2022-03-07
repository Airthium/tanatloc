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
const errors = {
  shareError: 'Unable to share'
}

/**
 * On share
 * @param workspace Workspace
 * @param project Project
 * @param selected Selected
 * @param swr SWR
 */
export const onShare = async (
  workspace: IWorkspaceWithData | undefined,
  project: IProjectWithData | undefined,
  selected: string[],
  swr: {
    mutateOneWorkspace?: (workspace: IWorkspaceWithData) => void
    mutateOneProject?: (project: IProjectWithData) => void
  }
): Promise<void> => {
  try {
    if (workspace) {
      // API
      await WorkspaceAPI.update({ id: workspace.id }, [
        {
          key: 'groups',
          value: selected
        }
      ])

      // Mutate
      const newWorkspace = { ...workspace }
      newWorkspace.groups = selected.map((s) => ({ id: s }))
      swr.mutateOneWorkspace(newWorkspace)
    } else {
      // API
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'groups',
          value: selected
        }
      ])

      // Mutate
      const newProject = { ...project }
      newProject.groups = selected.map((s) => ({ id: s }))
      swr.mutateOneProject(newProject)
    }
  } catch (err) {
    ErrorNotification(errors.shareError, err)

    throw err
  }
}

/**
 * Share
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - workspace (Object) Workspace `{ id, groups }`
 * - project (Object) Project `{ id, groups }`
 * - organizations (Array) Organizations
 * - swr (Object) SWR functions `{ mutateOneWorkspace, mutateOneProject }`
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
    string[],
    Dispatch<SetStateAction<string[]>>
  ] = useState([])

  // Effect
  useEffect(() => {
    // Default value
    const defaultValue = workspace
      ? workspace.groups?.map((group) => group.id)
      : project.groups?.map((group) => group.id)

    setSelected(defaultValue)
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
            key: group.id + '&' + user.id,
            title,
            disabled: true,
            checkable: false,
            value: group.id + '&' + user.id
          }
        })

        return {
          key: group.id,
          title: group.name,
          value: group.id,
          children: users
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
            (!style?.buttonBordered ? ' no-border ' : '')
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
        {treeData.length ? (
          <Form.Item
            label={
              <>
                Share this {workspace ? 'workspace' : 'project'} with
                organization groups or users
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
              value={selected}
              onChange={(value) => setSelected(value)}
            />
          </Form.Item>
        ) : (
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
        )}
      </Dialog>
    </>
  )
}

// TODO proptypes
Share.propTypes = {
  disabled: PropTypes.bool,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    groups: PropTypes.array
  }),
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    groups: PropTypes.array
  }),
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    mutateOneProject: PropTypes.func,
    mutateOneWorkspace: PropTypes.func
  }).isRequired
}

export default Share
