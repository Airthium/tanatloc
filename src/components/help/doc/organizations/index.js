import { Card, Collapse, Typography } from 'antd'

/**
 * Organizations documentation
 * @memberof Components.Help
 */
const Organizations = () => {
  return (
    <Card title="Organization">
      <Typography.Text>
        Allow you to manage an organizations, and associated groups for sharing.
      </Typography.Text>
      <Collapse>
        <Collapse.Panel header="Users">
          <Typography.Text>Add or remove owners and users.</Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel header="Groups">
          <Typography.Text>Add, modify or remove groups.</Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

export default Organizations
