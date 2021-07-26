import PropTypes from 'prop-types'
import { Divider, Layout, PageHeader, Typography } from 'antd'

import Add from '@/components/workspace/add'

/**
 * Welcome
 * @memberof module:components/dashboard
 * @param {Object} props Props
 */
const Welcome = ({ swr }) => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content className="Welcome no-scroll">
        <PageHeader
          backIcon={false}
          title={
            <Typography.Title level={4} className="pageheader-name">
              Welcome on board
            </Typography.Title>
          }
          footer={<Divider className="Tanatloc-divider" />}
        />
        <Typography.Text>
          Select a workspace to start, or <Add swr={swr} />
        </Typography.Text>
      </Layout.Content>
    </Layout>
  )
}

Welcome.propTypes = {
  swr: PropTypes.exact({
    addOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Welcome
