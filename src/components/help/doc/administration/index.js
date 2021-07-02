import { Card, Collapse, Typography } from 'antd'

/**
 * Administration documentation
 * @memberof module:components/help
 */
const Administration = () => {
  return (
    <Card title="Administration">
      <Typography.Text>
        Your need to be an administrator to have acces to this part
      </Typography.Text>
      <Collapse>
        <Collapse.Panel header="Users">
          <Typography.Text>
            You can manage users: create, delete or modify informations.
          </Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel header="Registration">
          <Typography.Text>
            Allow you to enable / disable the signup and to manage the required
            pattern for passwords.
          </Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

export default Administration
