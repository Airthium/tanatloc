import { css, SerializedStyles } from '@emotion/react'

import { variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  dashboard: css({
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }),
  sider: css({
    '& > div': {
      position: 'relative'
    }
  }),
  menu: css({
    overflowX: 'hidden',
    borderRight: '0px !important',

    '& .display-none': {
      display: 'none !important'
    },

    '& .ant-menu-item-divider': {
      border: '1px solid ' + variables.colorPrimary + ' !important'
    },

    '& .version': {
      position: 'absolute !important' as 'absolute',
      bottom: 0,
      left: '5px',
      cursor: 'default',
      lineHeight: '1em'
    }
  }),
  inDashboard: css({
    padding: '0 64px',
    height: '100vh'
  }),
  inDashboardTabs: css({
    color: variables.textColorLight
  })
}

export default style
