import { List, Typography } from 'antd'

const Variables = ({ configuration }) => {
  return (
    <List
      header={<Typography.Text strong>Variables list</Typography.Text>}
      itemLayout="vertical"
    >
      <List.Item>
        <Typography.Text strong>Global</Typography.Text>
        <br />
        <Typography.Text code>func appendLog(string)</Typography.Text>
        <br />
        <Typography.Text code>func appendError(string)</Typography.Text>
        <br />
        <Typography.Text code>meshN</Typography.Text>
        <br />
        <Typography.Text code>intN</Typography.Text>
        <br />
        <Typography.Text code>intN1</Typography.Text>
      </List.Item>
      {configuration.geometry && (
        <List.Item>
          <Typography.Text strong>Geometry</Typography.Text>
          <br />
          <Typography.Text>
            <Typography.Text code>
              meshN {configuration.geometry.name}
            </Typography.Text>
          </Typography.Text>
        </List.Item>
      )}
    </List>
  )
}

export default Variables
