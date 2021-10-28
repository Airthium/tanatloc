/** @namespace Components.Assets.Share */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Tooltip, TreeSelect } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'
import ProjectAPI from '@/api/project'

/**
 * Errors
 * @memberof Components.Assets.Share
 */
const errors = {
  shareError: 'Unable to share'
}

/**
 * Share
 * @memberof Components.Assets.Share
 * @param {Object} props Props `{ disabled, workspace, project, organizations, swr, style }`
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - workspace (Object) Workspace `{id, groups}`
 * - organizations (Array) Organizations
 * - swr (Object) SWR functions `{ mutateOneWorkspace, mutateOneProject }`
 * - style (Object) Button style
 */
const Share = ({ disabled, workspace, project, organizations, swr, style }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [selected, setSelected] = useState([])

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
            title,
            disabled: true,
            checkable: false,
            value: group.id + '&' + user.id
          }
        })

        return {
          title: group.name,
          value: group.id,
          children: users
        }
      })

      return {
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
   * On change
   * @param {Array} value Value
   */
  const onSelectChange = (value) => {
    setSelected(value)
  }

  /**
   * On share
   */
  const onShare = async () => {
    setLoading(true)

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
        newWorkspace.groups = selected
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
        newProject.groups = selected
        swr.mutateOneProject(newProject)
      }

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.shareError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Share">
        <Button
          type={style?.type || 'text'}
          key="share"
          disabled={disabled}
          icon={<ShareAltOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
      <Dialog
        title={'Share' + (workspace ? 'workspace' : 'project')}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onShare}
        loading={loading}
      >
        <TreeSelect
          mode="multiple"
          placeholder="Select groups or users"
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          style={{ width: '100%' }}
          treeData={treeData}
          treeDefaultExpandAll
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          value={selected}
          onChange={onSelectChange}
        />
      </Dialog>
    </>
  )
}

Share.propTypes = {
  disabled: PropTypes.bool,
  project: (props, propName, componentName) => {
    // Missing or invalid project
    if (
      !props['workspace'] &&
      (!props[propName] ||
        typeof props[propName] !== 'object' ||
        typeof props[propName].id !== 'string' ||
        (props[propName].groups && !Array.isArray(props[propName].groups)))
    )
      return new Error(
        'Missing or invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '.'
      )
  },
  workspace: (props, propName, componentName) => {
    // Missing or invalid workspace
    if (
      !props['project'] &&
      (!props[propName] ||
        typeof props[propName] !== 'object' ||
        typeof props[propName].id !== 'string' ||
        (props[propName].groups && !Array.isArray(props[propName].groups)))
    )
      return new Error(
        'Missing or invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '.'
      )
  },
  organizations: PropTypes.array.isRequired,
  swr: (props, propName, componentName) => {
    // Missing swr
    if (!props[propName])
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. swr missing'
      )

    if (props['workspace']) {
      // Missing or invalid swr.mutateOneWorkspace
      if (
        !props[propName].mutateOneWorkspace ||
        typeof props[propName].mutateOneWorkspace !== 'function'
      )
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. mutateOneWorkspace missing or invalid'
        )
    } else {
      // Missing or invalid swr.mutateOneProject
      if (
        !props[propName].mutateOneProject ||
        typeof props[propName].mutateOneProject !== 'function'
      )
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. mutateOneProject missing or invalid'
        )
    }
  }
}

export default Share
