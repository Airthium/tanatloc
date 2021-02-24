import { useState } from 'react'
import { Button, Select } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import GroupAPI from '@/api/group'
import WorkspaceAPI from '@/api/workspace'

const errors = {
  shareError: 'Unable to share workspace'
}

/**
 * Share
 * @param {Object} props Props
 */
const Share = ({ workspace }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState([])

  // Data
  const [groups] = GroupAPI.useGroups()
  const [, { mutateOneWorkspace }] = WorkspaceAPI.useWorkspaces()

  /**
   * On change
   * @param {Array} value Value
   */
  const onChange = (value) => {
    console.log(value)
    setValues(value)
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
          value: values
        }
      ])

      // Mutate
      const newWorkspace = { ...workspace }
      newWorkspace.groups = values
      mutateOneWorkspace(newWorkspace)

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.shareError, err)
    }

    setLoading(false)
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
        Groups:
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select groups"
          onChange={onChange}
          defaultValue={workspace?.groups?.map((g) => g.id)}
        >
          {groups.map((group) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
      </Dialog>
    </>
  )
}

export default Share
