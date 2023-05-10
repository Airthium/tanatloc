/** @module Plugins.Local.Components */

import { useCallback } from 'react'
import { Button, Typography, Space } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  onSelect: () => void
}

/**
 * Local
 * @param props Props
 * @returns Local
 */
const Local = ({ onSelect }: IProps): React.JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(() => {
    onSelect()
  }, [onSelect])

  /**
   * Render
   */
  return (
    <Space className={globalStyle.fullWidth}>
      <Typography.Text>Local computing</Typography.Text>
      <Button type="primary" onClick={onClick} icon={<SelectOutlined />}>
        Select
      </Button>
    </Space>
  )
}

export default Local
