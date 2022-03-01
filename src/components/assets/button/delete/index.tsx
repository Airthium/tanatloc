/** @module Components.Assets.Button.Delete */

import PropTypes from 'prop-types'
import { ReactChild, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  text?: string
  children?: ReactChild | ReactChild[]
  onDelete: () => Promise<void>
}

/**
 * Delete button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - bordered (boolean) Set border
 * - text (string) DeleteDialog text
 * - children (React child) Button children
 * - onDelete (async Function) DeleteDialog click (this function can throw an error)
 */
const DeleteButton = ({
  disabled,
  loading,
  bordered,
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
          className={'no-background ' + (bordered ? '' : 'no-border')}
          danger
          disabled={disabled}
          loading={loading}
          icon={<DeleteOutlined />}
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
  bordered: PropTypes.bool,
  text: PropTypes.string,
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired
}

export default DeleteButton
