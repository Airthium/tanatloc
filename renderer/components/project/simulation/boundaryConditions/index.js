import { Button, Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

const BoundaryConditions = ({ project, simulation }) => {
  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} />
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
