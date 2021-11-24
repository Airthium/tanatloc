import PropTypes from 'prop-types'
import { Button, Typography, Space } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

export interface IProps {
  onSelect: Function
}

/**
 * Local
 * @memberof Plugins.Local
 * @param {Object} props Props `{ onSelect }`
 * @returns {jsx} Render
 */
const Local = ({ onSelect }: IProps): JSX.Element => {
  const onClick = () => {
    onSelect()
  }

  return (
    <Space style={{ width: '100%' }}>
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
