import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  selector: css({
    padding: '20px',
    height: '60vh',
    overflow: 'auto',

    figure: {
      maxWidth: '80%',
      border: '1px solid #f0f0f0',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },

    figcaption: {
      textAlign: 'center',
      color: '#9c9c9c'
    },

    img: {
      maxWidth: '80%'
    }
  }),
  geometriesList: css({
    padding: '20px',
    borderTop: '1px solid #bfbfbf',
    borderBottom: '1px solid #bfbfbf',
    boxShadow: '0px -1px 0px #f0f0f0',

    '&:hover': {
      cursor: 'pointer'
    }
  }),
  waring: css({
    '& .ant-collapse-content': {
      backgroundColor: 'rgba(250, 173, 20, 0.5) !important'
    }
  }),
  error: css({
    '& .ant-collapse-content': {
      backgroundColor: 'rgba(255, 77, 79, 0.5) !important'
    }
  })
}

export default style
