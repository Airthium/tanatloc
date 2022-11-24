/** @module Plugins.Local.Components */

import { Button, Typography, Space } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import { globalStyle } from '@/styles'

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
const Local = ({ onSelect }: IProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = () => {
    onSelect()
  }

  /**
   * Render
   */
  return (
    <Space css={globalStyle.fullWidth}>
      <Typography.Text>Local computing</Typography.Text>
      <Button
        type="primary"
        onClick={() => onClick()}
        icon={<SelectOutlined />}
      >
        Select
      </Button>
    </Space>
  )
}

export default Local
