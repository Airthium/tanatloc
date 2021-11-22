import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Divider, Layout, PageHeader, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Add from '@/components/workspace/add'

interface IProps {
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
  // State
  const [add, setAdd]: [boolean, Function] = useState(false)

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
          Select a workspace to start, or{' '}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAdd(true)}
          >
            add one
          </Button>
        </Typography.Text>
        <Add
          visible={add}
          swr={{ addOneWorkspace: swr.addOneWorkspace }}
          setVisible={setAdd}
        />
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
