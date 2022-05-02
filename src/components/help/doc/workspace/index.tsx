/** @module Components.Help.Doc.Workspace */

import { Card, Typography } from 'antd'

/**
 * Workspace documentation
 * @returns Workspace
 */
const Workspace = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Workspace">
      <Typography.Text>
        The workspace is the place where all the projects are. You can create
        several workspaces to sort your different projects.
        <br />
        You can share your workspace with other users or groups throught
        organizations.
      </Typography.Text>
    </Card>
  )
}

export default Workspace
