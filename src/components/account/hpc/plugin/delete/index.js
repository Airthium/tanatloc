import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

/**
 * Errors (hpc/delete)
 */
const errors = {
  updateError: 'Unable to delete plugin'
}

/**
 * Delete plugin
 * @param {Object} props Props
 */
const Delete = ({ plugin, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // API
      await PluginAPI.del(plugin)

      // Mutate
      swr.delOnePlugin(plugin)
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        title="Delete plugin"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete "{plugin?.configuration?.name?.value || 'plugin'}"?
      </DeleteDialog>
      <Button type="danger" loading={loading} onClick={() => setVisible(true)}>
        Delete
      </Button>
    </>
  )
}

Delete.propTypes = {
  plugin: PropTypes.object.isRequired,
  swr: PropTypes.shape({
    delOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
