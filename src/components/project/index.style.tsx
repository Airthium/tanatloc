import { variables } from '@/styles'
import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  sider: css({
    height: '100vh',
    overflow: 'hidden',

    '& .ant-layout-sider-children': {
      height: '100vh',
      overflow: 'hidden',
      borderRight: '1px solid ' + variables.colorPrimary
    }
  }),
  menu1: css({
    maxHeight: 'calc(100vh - 195px)',
    overflow: 'auto',
    overflowX: 'hidden',

    '& .ant-menu-item-divider': {
      border: '1px solid ' + variables.colorPrimary,
      margin: '0 30px !important'
    },

    '& .Menu-title': {
      marginTop: '15px !important',
      lineHeight: '1.5em !important',
      cursor: 'unset',
      whiteSpace: 'normal',
      height: '4em'
    }
  }),
  menuScroll: css({
    maxHeight: 'calc(100vh - 180px)',
    overflow: 'auto',
    overflowX: 'hidden'
  }),
  menu2: css({
    '& .SubMenu': {
      '& > div': {
        backgroundColor: '#f5f5f5',
        border: '1px solid #d9d9d9'
      },

      ul: {
        backgroundColor: 'white !important',

        li: {
          paddingLeft: '24px !important',

          '> div': {
            paddingLeft: '0 !important'
          },

          ul: {
            li: {
              paddingLeft: '24px !important',
              position: 'relative !important' as 'relative',
              overflow: 'visible !important',

              ':not(:last-child)::before': {
                position: 'absolute',
                content: '""',
                border: '1px solid #d9d9d9',
                backgroundColor: '#d9d9d9',
                height: '18px',
                width: '0px',
                top: '33px',
                left: '30px',
                zIndex: 100
              }
            }
          }
        }
      },

      '& .display-none': {
        display: 'none'
      }
    },
    button: {
      width: '100%'
    }
  })
}

export default style
