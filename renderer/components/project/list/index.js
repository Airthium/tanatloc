import { Button, Layout, PageHeader, Row } from 'antd'
import { PlusCircleTwoTone } from '@ant-design/icons'

import ProjectCard from '../card'

export default () => {
  return (
    <>
      <PageHeader
        title={<h1 className="ft-white ft-bold">My Projects</h1>}
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<PlusCircleTwoTone />}
            size="large"
          >
            Create A New Project
          </Button>
        ]}
      />

      <Layout.Content className="scroll">
        <Row justify="center" gutter={[0, 16]}>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </Row>
      </Layout.Content>
    </>
  )
}
