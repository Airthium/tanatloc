import { css, SerializedStyles } from '@emotion/react'
import { variables } from '@/styles'

import { mediaQuery } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  footer: css({
    background: variables.colorPrimary + ' !important',
    width: 'calc(100% + 200px)',
    marginLeft: '-100px',
    marginTop: '90px',

    [mediaQuery]: {
      width: 'calc(100% + 40px)',
      marginLeft: '-20px',
      padding: 'unset !important',
      paddingBottom: '20px  !important'
    }
  }),
  head: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    justifyItems: 'center',

    [mediaQuery]: {
      display: 'flex',
      flexDirection: 'column',

      ul: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    }
  }),
  card: css({
    backgroundColor: 'transparent',
    boxShadow: 'none !important',

    '& .ant-card-head': {
      border: 'none'
    },

    li: {
      borderBlockEnd: 'none !important',
      paddingLeft: '0 !important'
    },

    button: {
      marginLeft: '-15px'
    },

    [mediaQuery]: {
      '& .ant-card-body': {
        paddingTop: '0'
      },

      '& .ant-space': {
        flexDirection: 'row'
      }
    }
  }),
  divider: css({
    width: '100%',
    height: '1px',
    border: '1px solid #000'
  }),
  foot: css({
    display: 'flex',
    justifyContent: 'space-between',

    [mediaQuery]: {
      display: 'unset',
      justifyContent: 'unset',

      img: {
        display: 'none'
      },

      '& .ant-typography': {
        textAlign: 'right',
        marginRight: '20px'
      }
    }
  })
}

export default style
