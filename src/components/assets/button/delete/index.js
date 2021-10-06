import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

/**
 * Delete button
 * @memberof Components.Assets.Button
 * @param {Object} props Props `{ disabled, loading, text, children, onDelete }`
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - text (string) DeleteDialog text
 * - children (React node) Button children
 * - onDelete (Function) DeleteDialog click (this function can throw an error)
 */
const DeleteButton = ({ disabled, loading, text, children, onDelete }) => {
  // State
  const [visible, setVisible] = useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        visible={visible}
        loading={loading}
        onCancel={() => setVisible(false)}
        onOk={async () => {
          await onDelete()
          setVisible(false)
        }}
      >
        {text || 'Are you sure?'}
      </DeleteDialog>
      <Tooltip title={children || 'Delete'}>
        <Button
          disabled={disabled}
          loading={loading}
          icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
          style={{ backgroundColor: 'none', border: 'none' }}
          onClick={() => setVisible(true)}
        >
          {children}
        </Button>
      </Tooltip>
    </>
  )
}

DeleteButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired
}

export default DeleteButton
