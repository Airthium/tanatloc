/** @module Components.Help.Doc.Administration */

import { Card, Collapse, Typography } from 'antd'

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
      {/* @ts-ignore */}
      <Collapse>
        {/* @ts-ignore */}
        <Collapse.Panel key="users" header="Users">
          <Typography.Text>
            You can manage users: create, delete or modify informations.
          </Typography.Text>
        </Collapse.Panel>
        {/* @ts-ignore */}
        <Collapse.Panel key="registration" header="Registration">
          <Typography.Text>
            Allow you to enable / disable the signup and to manage the required
            pattern for passwords.
          </Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

Administration.propTypes = {}

export default Administration
