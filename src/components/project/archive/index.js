import { Button, Tooltip } from 'antd'
import { HddOutlined } from '@ant-design/icons'

const Archive = () => {
  return (
    <Tooltip title="Archive">
      <Button type="link" icon={<HddOutlined />} />
    </Tooltip>
  )
}

export default Archive
