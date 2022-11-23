import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  dashboard: css({
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }),
  //   sider: css({
  //     '& > div': {
  //       position: 'relative'
  //     }
  //   }),
  menu: css({
    overflowX: 'hidden',
    borderRight: '0px !important'
  })
}

export default style
