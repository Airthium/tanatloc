import PropTypes from 'prop-types'
import { Divider, Layout, PageHeader, Typography } from 'antd'

import Add from '@/components/workspace/add'

export interface IProps {
  swr: {
    addOneWorkspace: Function
  }
}

/**
 * Welcome
 * @memberof Components.Dashboard
 * @param props Props
 */
const Welcome = ({ swr }: IProps): JSX.Element => {
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
          footer={<Divider />}
        />
        <Typography.Text>Select a workspace to start, or </Typography.Text>
        <Add swr={{ addOneWorkspace: swr.addOneWorkspace }} />
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
