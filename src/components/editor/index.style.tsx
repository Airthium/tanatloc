import { css, SerializedStyles } from '@emotion/react'

import { variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  editor: css({
    width: '100%',
    height: '100%',
    overflow: 'hidden',

    '& .ant-menu-item-divider': {
      border: '1px solid ' + variables.colorPrimary + ' !important',
      margin: '0 30px !important'
    }
  }),
  header: css({
    background: 'white !important',

    '& > div': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }),
  steps: css({
    width: '206px',
    margin: '25px',

    '& .ant-steps-item-title': {
      lineHeight: '20px !important'
    }
  }),
  code: css({
    display: 'flex',
    width: '100%',
    height: '100%'
  })
}

export default style
