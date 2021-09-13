import { Button, Typography, Space } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

const Local = ({ onSelect }) => {
  const onClick = () => {
    onSelect()
  }

  return (
    <Space style={{ width: '100%' }}>
      <Typography.Text>Local computing</Typography.Text>
      <Button onClick={onClick} icon={<SelectOutlined />} />
    </Space>
  )
}

export default Local
