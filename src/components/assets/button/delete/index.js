import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

/**
 * Delete button
 * @memberof module:@memberof module:components/assets/button
 * @param {Object} props Props
 */
const DeleteButton = ({ disabled, loading, onDelete }) => {
  // State
  const [visible, setVisible] = useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
      >
        Are you sure to delete this condition?
      </DeleteDialog>
      <Button
        disabled={disabled}
        loading={loading}
        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
        style={{ backgroundColor: 'none', border: 'none' }}
        onClick={() => setVisible(true)}
      />
    </>
  )
}

DeleteButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
}

export default DeleteButton
