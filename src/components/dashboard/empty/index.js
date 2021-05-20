import { Empty, Typography } from 'antd'

const SharedEmpty = () => {
  /**
   * Render
   */
  return (
    <Empty
      image="images/empty.svg"
      description={
        <Typography.Paragraph>
          No shared workspaces or projects
        </Typography.Paragraph>
      }
    />
  )
}

export default SharedEmpty
