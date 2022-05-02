/** @module Components.Help.Doc.Organization */

import { Card, Collapse, Typography } from 'antd'

/**
 * Organizations documentation
 * @returns Organizations
 */
const Organizations = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Organization">
      <Typography.Text>
        Allow you to manage an organization, and associated groups for sharing
        purpose.
      </Typography.Text>
      <Collapse>
        <Collapse.Panel key="users" header="Users">
          <Typography.Text>
            Add or remove owners and users.
            <br />
            Owners and users in an organization can be used to share a workspace
            or a project.
          </Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel key="groups" header="Groups">
          <Typography.Text>
            Add, modify or remove groups.
            <br />
            Groups in an organization can be used to share a workspace or a
            project.
          </Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

Organizations.propTypes = {}

export default Organizations
