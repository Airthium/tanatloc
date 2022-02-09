import PropTypes from 'prop-types'
import { ReactChild, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

export interface IProps {
  disabled?: boolean
  bordered?: boolean
  loading?: boolean
  text?: string
  children?: ReactChild | ReactChild[]
  onDelete: () => Promise<void>
}

/**
 * Delete button
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - text (string) DeleteDialog text
 * - children (React child) Button children
 * - onDelete (async Function) DeleteDialog click (this function can throw an error)
 */
const DeleteButton = ({
  disabled,
  bordered,
  loading,
  text,
  children,
  onDelete
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        visible={visible}
        loading={loading}
        title="Delete"
        onCancel={() => setVisible(false)}
        onOk={async () => {
          await onDelete()
          setVisible(false)
        }}
      >
        {text || 'Are you sure?'}
      </DeleteDialog>
      <Tooltip title={'Delete'}>
        <Button
          danger
          disabled={disabled}
          loading={loading}
          icon={<DeleteOutlined />}
          style={{ backgroundColor: 'none', border: !bordered && 'none' }}
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
