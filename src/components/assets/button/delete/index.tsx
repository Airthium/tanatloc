/** @module Components.Assets.Button.Delete */

import PropTypes from 'prop-types'
import { Dispatch, ReactChild, SetStateAction, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  text?: string
  title?: string
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
 * - title (string) DeleteDialog title
 * - children (React child) Button children
 * - onDelete (async Function) DeleteDialog click (this function can throw an error)
 * @returns DeleteButton
 */
const DeleteButton = ({
  disabled,
  loading,
  bordered,
  text,
  title,
  children,
  onDelete
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        visible={visible}
        loading={loading}
        title={title || 'Delete'}
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
  title: PropTypes.string,
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired
}

export default DeleteButton
