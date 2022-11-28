import { css, SerializedStyles } from '@emotion/react'

import { variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  shared: css({
    display: 'flex',
    gap: '20px',
    marginBottom: '16px',

    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  }),
  tabs: css({
    margin: '16px 0',
    color: variables.textColorLight,

    '& .ant-tabs-nav::before': {
      borderBottom: 'none'
    }
  })
}

export default style
