import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, TreeSelect } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

/**
 * Error share
 * @memberof module:components/workspace
 */
const errors = {
  shareError: 'Unable to share workspace'
}

/**
 * Share
 * @memberof module:components/workspace
 * @param {Object} props Props
 */
const Share = ({ workspace, organizations, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [selected, setSelected] = useState([])

  // Effect
  useEffect(() => {
    // Default value
    const defaultValue = workspace.groups?.map((group) => group.id)
    setSelected(defaultValue)
  }, [])

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
      // Update workspace
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

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.shareError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        key="share"
        icon={<ShareAltOutlined />}
        onClick={() => setVisible(true)}
      >
        Share it
      </Button>
      <Dialog
        title="Share workspace"
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
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired,
    groups: PropTypes.array
  }).isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Share
