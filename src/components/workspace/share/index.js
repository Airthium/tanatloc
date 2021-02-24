import { Button } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

const Share = () => {
  return (
    <Button key="share" icon={<ShareAltOutlined />}>
      Share it
    </Button>
  )
}

export default Share
