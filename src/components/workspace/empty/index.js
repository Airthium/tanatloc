import { PageHeader } from 'antd'

import Add from '../add'

/**
 * Empty
 * @memberof module:'src/components/workspace
 */
const Empty = () => {
  /**
   * Render
   */
  return (
    <>
      <PageHeader
        backIcon={false}
        title={'No workspace selected'}
        extra={[<Add key="add" />]}
      ></PageHeader>
    </>
  )
}

export default Empty
