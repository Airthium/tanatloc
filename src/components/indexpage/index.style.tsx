import { css, SerializedStyles } from '@emotion/react'
import { variables } from '@/styles'
const style: { [key: string]: SerializedStyles } = {
  index: css({
    display: 'block',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    overflowX: 'hidden',
    padding: '0 100px'
  }),

  indexHeader: css({
    position: 'sticky',
    top: '0',
    zIndex: 10,
    margin: '0 -100px',
    padding: '20px 120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white !important',
    marginBottom: '90px',
    boxShadow: '0px 0px 28px 8px rgba(0, 0, 0, 0.05)',

    ul: {
      flex: '1 1 auto',
      justifyContent: 'center',
      borderBottom: 'none',

      li: {
        padding: '0 !important',

        ':after': {
          display: 'none'
        }
      }
    },

    '@media all and (max-width: 1100px)': {
      '& .Index-get-started': {
        display: 'none'
      },
      '& .Index-login-button': {
        display: 'none'
      }
    }
  }),

  indexMenu: css({
    width: '100%',

    '@media all and (max-width: 1100px)': {
      display: 'none'
    },

    '& .Index-get-started': {
      display: 'none'
    },
    '& .Index-login-button': {
      display: 'none'
    }
  }),

  indexMenuMobile: css({
    display: 'none',

    '@media all and (max-width: 1100px)': {
      display: 'flex !important',
      justifyContent: 'center'

      // '& .Index-get-started': {
      //   display: 'flex',
      //   width: '100%'
      // },
      // '& .Index-login-button': {
      //   display: 'flex',
      //   width: '100%'
      // }
    }
  }),

  indexContent: css({
    maxWidth: '1200px',
    margin: 'auto'
  }),

  rightCss: css({
    display: 'grid !important',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'unset !important',
    justifyItems: 'stretch',
    gridGap: '20px'
  }),

  leftCss: css({
    padding: '50px !important'
  }),

  indexCaseStudy: css({
    boxShadow:
      '0px 0px 6px -4px rgba(0, 0, 0, 0.12), 0px 0px 16px rgba(0, 0, 0, 0.08), 0px 0px 28px 8px rgba(0, 0, 0, 0.05)',
    justifyItems: 'space-around !important'
  }),

  indexCaseStudyLeft: css({
    width: '70%',
    h3: {
      marginTop: '-0.5em !important'
    },
    '& > * > * > * > h2.ant-typography': {
      textAlign: 'left'
    }
  }),

  indexPlugins: css({
    display: 'flex',
    justifyContent: 'space-around',
    columnWidth: '160px',
    columnGap: 0,
    '> div': {
      breakInside: 'avoid-column',
      pageBreakInside: 'avoid',
      width: '160px',
      maxWidth: '160px',
      height: '160px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    '& .ant-avatar': {
      backgroundColor: variables.colorPrimary,
      padding: '5px',
      lineHeight: '60px !important',
      '> img': {
        objectFit: 'contain !important' as 'contain',
        margin: 'auto'
      }
    },
    '@media all and (max-width: 1100px)': {
      margin: 'auto',
      marginTop: '20px',
      flexDirection: 'column',
      alignItems: 'center',
      '> div': {
        height: 'unset !important',
        marginBottom: '20px !important'
      }
    }
  }),

  indexSteps: css({
    margin: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    rowGap: '25px',
    columnGap: '25px',
    '& .ant-steps-item': {
      marginBottom: '20px'
    },
    '& .ant-steps-item-title': {
      marginTop: '-8px'
    },
    '& .ant-steps-item-icon': {
      marginTop: '10px',
      width: '64px',
      height: '64px',
      lineHeight: '64px',
      fontSize: '32px',
      backgroundColor: 'white !important',
    },
    '& .ant-steps-icon': {
      color: variables.colorPrimary + " !important"
    },
    '& .ant-steps-item-tail': {
      display: 'none !important'
    },
    '& button.download': {
      height: '40px',
      margin: '5px',
    },
    '& img': {
      height: '30px',
      marginRight: '3px',
    }
  })
}

export default style
