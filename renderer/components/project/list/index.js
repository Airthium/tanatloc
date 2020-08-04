import { Row } from 'antd'

import ProjectCard from '../card'

const ProjectList = () => {
  return (
    <Row gutter={[0, 16]} justify="center">
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
    </Row>
  )
}

export default ProjectList
