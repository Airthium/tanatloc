/** @module Components.Help.Doc.Project */

import { Card, Collapse, Typography } from 'antd'

/**
 * Project documentation
 * @returns Project
 */
const Project = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Project">
      <Typography.Text>
        The project is used to manage geometries and simulation.
      </Typography.Text>
      <Collapse>
        <Collapse.Panel key="archive" header="Archive Project">
          <Typography.Text>
            You can archive a project to save disk space.
            <br />
            Once archived, a project is not editable anymore.
            <br />
            At the archive time, you can download a{' '}
            <code>.tanatlocarchive</code> file that contains all the data to
            restore your project later.
            <br />
            There is several options to manage an archived projects:
            <ul>
              <li>
                Restore the project from the previously downloaded archive file;
              </li>
              <li>Restore the project from the archive file on the server;</li>
              <li>
                Delete the archive file on the server, in the case you will not
                be able to restore the project from the server archive file.
              </li>
            </ul>
          </Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

export default Project
