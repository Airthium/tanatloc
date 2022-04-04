/** @module Plugins.Local.Components */

import PropTypes from 'prop-types'
import { Button, Typography, Space } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

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
    <Space className="full-width">
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

Local.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default Local
