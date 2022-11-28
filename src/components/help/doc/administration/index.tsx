/** @module Components.Help.Doc.Administration */

import { Card, Typography } from 'antd'

/**
 * Administration documentation
 * @returns Administration
 */
const Administration = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Administration">
      <Typography.Text>
        Your need to be an administrator to have acces to this part
      </Typography.Text>

      <Typography.Title level={5}>Users</Typography.Title>

      <Typography.Text>
        You can manage users: create, delete or modify informations.
      </Typography.Text>

      <Typography.Title level={5}>Registration</Typography.Title>
      <Typography.Text>
        Allow you to enable / disable the signup and to manage the required
        pattern for passwords.
      </Typography.Text>
    </Card>
  )
}

export default Administration
