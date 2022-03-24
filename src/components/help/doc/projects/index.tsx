/** @module Components.Help.Doc.Project */

import { Card, Collapse, Typography } from 'antd'

/**
 * Projects documentation
 * @returns Projects
 */
const Projects = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Project">
      <Typography.Text>Create a simulation and test it.</Typography.Text>
      <Collapse>
        <Collapse.Panel key="archive" header="Archive Project">
          <Typography.Text>
            You can archive a project. It will download a .zip of it and
          </Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel key="groups" header="Groups">
          <Typography.Text>Add, modify or remove groups.</Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

Projects.propTypes = {}

export default Projects
