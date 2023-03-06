import { css, SerializedStyles } from '@emotion/react'

import { mediaQuery, variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  index: css({
    display: 'block',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    overflowX: 'hidden',
    padding: '0 100px',

    [mediaQuery]: {
      padding: '0 20px !important'
    }
  }),
  header: css({
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

    [mediaQuery]: {
      width: 'calc(100% + 40px)',
      marginLeft: '-20px',
      padding: '20px 10px',

      button: {
        display: 'none'
      }
    }
  }),
  menu: css({
    width: '100%',

    '& .Menu-getStarted': {
      display: 'none'
    },
    '& .Menu-login': {
      display: 'none'
    },

    [mediaQuery]: {
      display: 'none'
    }
  }),
  menuMobile: css({
    display: 'none',

    [mediaQuery]: {
      display: 'flex !important',
      justifyContent: 'center'
    }
  }),
  content: css({
    maxWidth: '1200px',
    margin: 'auto'
  }),
  indexPadding: css({
    padding: '50px',
    [mediaQuery]: {
      padding: '20px !important'
    }
  }),
  indexImgShadow: css({
    boxShadow:
      '0px 0px 6px -4px rgba(0, 0, 0, 0.12), 0px 0px 16px rgba(0, 0, 0, 0.08), 0px 0px 28px 8px rgba(0, 0, 0, 0.05)'
  }),
  solveLeft: css({
    paddingLeft: '50px !important',
    paddingRight: '50px !important',

    [mediaQuery]: {
      paddingLeft: '20px !important',
      paddingRight: '20px !important'
    }
  }),
  models: css({
    display: 'grid !important',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'unset !important',
    justifyItems: 'stretch',
    gridGap: '20px',

    '& .ant-checkbox-wrapper': {
      marginInlineStart: '0 !important'
    },

    '& .ant-checkbox-inner': {
      borderColor: '#fff'
    },

    [mediaQuery]: {
      display: 'flex !important',
      flexDirection: 'column !important' as 'column',
      padding: '20px !important'
    }
  }),
  indexPlugins: css({
    display: 'flex',
    justifyContent: 'space-around',
    columnWidth: '160px',
    columnGap: 0,
    marginTop: '40px !important',

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

    [mediaQuery]: {
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
  electron: css({
    display: 'flex',
    flexDirection: 'column',

    img: {
      maxWidth: '80%',
      alignSelf: 'center'
    }
  }),
  caseStudy: css({
    boxShadow:
      '0px 0px 6px -4px rgba(0, 0, 0, 0.12), 0px 0px 16px rgba(0, 0, 0, 0.08), 0px 0px 28px 8px rgba(0, 0, 0, 0.05)',
    justifyItems: 'space-around !important'
  }),
  caseStudyLeft: css({
    width: '70%',

    h3: {
      marginTop: '-0.5em !important'
    }
  }),
  caseStudyRight: css({
    [mediaQuery]: {
      img: {
        height: '250px'
      }
    }
  }),
  steps: css({
    margin: 'auto',
    display: 'grid !important',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr',
    rowGap: '25px',
    columnGap: '25px',

    '& .ant-steps-item': {
      marginBottom: '20px'
    },

    '& .ant-steps-item-title': {
      fontWeight: 'bold',
      marginTop: '-8px'
    },

    '& .ant-steps-item-icon': {
      marginTop: '10px',
      width: '64px',
      height: '64px',
      lineHeight: '64px',
      fontSize: '32px',
      backgroundColor: 'white !important'
    },

    '& .ant-steps-icon': {
      color: variables.colorPrimary + ' !important'
    },

    '& .ant-steps-item-tail': {
      display: 'none !important'
    },

    '& button.download': {
      height: '40px',
      margin: '5px',
      display: 'inline-flex',
      alignItems: 'center'
    },

    '& img': {
      height: '30px',
      marginRight: '3px'
    },

    [mediaQuery]: {
      width: 'unset !important',
      gridTemplateColumns: '1fr'
    }
  }),
  about: css({
    boxShadow:
      '0px 0px 6px -4px rgba(0, 0, 0, 0.12), 0px 0px 16px rgba(0, 0, 0, 0.08), 0px 0px 28px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '200px',
    padding: '50px 0'
  }),
  turbine: css({
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/images/indexpage/turbine.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }),
  crowdfunding: css({
    [mediaQuery]: {
      a: {
        margin: 'auto'
      }
    }
  })
}

export default style
