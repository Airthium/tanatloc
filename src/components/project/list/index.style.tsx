import { variables } from '@/styles'
import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  card: css({
    display: 'flex',
    flexDirection: 'column',
    width: '260px',
    height: '412px',

    '& .ant-card-head': {
      height: '80px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center'
    },

    '& .ant-card-head-title': {
      whiteSpace: 'unset !important' as 'unset'
    },

    '& .ant-card-cover': {
      flex: '1 0 auto',
      display: 'flex',
      alignItems: 'center'
    },

    '& .ant-card-body': {
      height: '70px',
      borderTop: '1px solid #f0f0f0',
      padding: '0 24px'
    },

    '& .ant-card-actions': {
      '> li': {
        margin: '8px 0',
        flex: '0 1 auto'
      }
    }
  }),
  cardArchived: css({
    backgroundColor: '#fafafa'
  }),
  carousel: css({
    margin: 'auto !important',
    textAlign: 'center',

    '& img': {
      margin: 'auto !important'
    },

    '& .dots': {
      bottom: '10px !important',
      left: 'unset !important',
      right: 'calc(50% - 30px) !important',
      padding: '1px',
      paddingLeft: 'unset !important',
      margin: 'unset !important',
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
      borderRadius: '5px !important',

      li: {
        height: '10px !important',

        button: {
          height: '10px !important',
          borderRadius: '5px !important',
          background: variables.colorPrimary + ' !important'
        }
      }
    }
  }),
  carouselSnapshot: css({
    width: '260px',
    height: '190px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    cursor: 'pointer',

    img: {
      maxWidth: '98%',
      maxHeight: '98%'
    }
  }),
  carouselSnapshotArchived: css({
    cursor: 'not-allowed'
  }),
  carouselDescription: css({
    width: '260px',
    height: '190px',
    padding: '5px 10px',
    cursor: 'pointer',

    '& .ant-typography': {
      marginBottom: 0
    }
  }),
  carouselDescriptionArchived: css({
    cursor: 'not-allowed'
  })
}

export default style
