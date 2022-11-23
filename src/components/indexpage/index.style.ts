import { css, SerializedStyles } from '@emotion/react'

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
      textAlign: 'left',
    }
  })
}

export default style
