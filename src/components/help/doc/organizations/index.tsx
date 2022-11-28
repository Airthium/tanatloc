/** @module Components.Help.Doc.Organization */

import { Card, Typography } from 'antd'

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
      <Typography.Title level={5}>Users</Typography.Title>
      <Typography.Text>
        Add or remove owners and users.
        <br />
        Owners and users in an organization can be used to share a workspace or
        a project.
      </Typography.Text>

      <Typography.Title level={5}>Groups</Typography.Title>
      <Typography.Text>
        Add, modify or remove groups.
        <br />
        Groups in an organization can be used to share a workspace or a project.
      </Typography.Text>
    </Card>
  )
}

export default Organizations
