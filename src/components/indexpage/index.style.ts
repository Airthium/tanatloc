import { css } from '@emotion/react'

const style = {
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
        padding: '0 !important'
      }
    }
  })
}

export default style
