import { Empty, Typography } from 'antd'

const SharedEmpty = () => {
  /**
   * Render
   */
  return (
    <Empty
      description={
        <Typography.Paragraph>
          No shared workspaces or projects
        </Typography.Paragraph>
      }
    />
  )
}

export default SharedEmpty
