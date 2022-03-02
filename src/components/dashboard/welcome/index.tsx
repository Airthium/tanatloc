/** @module Components.Dashboard.Welcome */

import PropTypes from 'prop-types'
import { Divider, Empty, Layout, PageHeader, Typography } from 'antd'

import { INewWorkspace } from '@/database/index.d'

import Add from '@/components/workspace/add'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneWorkspace: (workspace: INewWorkspace) => void
  }
}

/**
 * Welcome
 * @param props Props
 * @returns Welcome
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
        <Empty
          image="images/empty.svg"
          description={'Select a workspace to start, or get started !'}
        >
          <Add
            swr={{
              addOneWorkspace: swr.addOneWorkspace
            }}
          />
        </Empty>
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
