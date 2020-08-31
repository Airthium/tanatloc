import { PageHeader } from 'antd'

import Add from '../add'

const Empty = () => {
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
