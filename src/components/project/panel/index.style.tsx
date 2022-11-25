import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  panel: css({
    position: 'absolute',
    top: 0,
    left: '-1px',
    width: '256px',
    maxHeight: '100vh',
    zIndex: 100,
    overflow: 'hidden',

    img: {
      maxWidth: '80%'
    },

    '& .ant-card-head': {
      height: '48px',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '0 12px',
      border: 'none',

      '.ant-btn': {
        border: 'none'
      }
    },

    '& .ant-card': {
      border: 'none'
    },

    '& .ant-collapse': {
      border: 'none'
    },

    '& .ant-collapse-item': {
      border: 'none'
    },

    '& .ant-collapse-content-box': {
      padding: '0 !important',
      backgroundColor: '#fafafa',

      '.ant-card-head': {
        backgroundColor: '#fafafa'
      },

      '.ant-card-body': {
        backgroundColor: '#fafafa'
      }
    }
  })
}

export default style
