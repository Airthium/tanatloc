import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  header: css({
    position: 'sticky',
    top: '0',
    zIndex: 10,
    padding: '20px 120px',
    display: 'flex',
    alignItems: 'center',
    background: 'white !important',
    marginBottom: '20px',
    boxShadow: '0px 0px 28px 8px rgba(0, 0, 0, 0.05)',
    '.ant-typography': {
      margin: '0 20px'
    }
  }),
  logo: css({
    padding: '20px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '64px',
    cursor: 'pointer'
  }),
  content: css({
    padding: '0 50px 50px 50px'
  }),
  contentTools: css({
    display: 'flex',
    justifyContent: 'space-between',
    '> div': {
      display: 'flex',
      alignItems: 'center',
      '>div': {
        marginLeft: '10px'
      }
    },
    '.ant-input': {
      width: '50%'
    }
  }),
  footer: css({
    textAlign: 'center',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.05)'
  }),
  posts: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px'
  }),
  postCard: css({
    display: 'flex',
    flexDirection: 'column',
    '.ant-card-head-wrapper': {
      flexDirection: 'column',
      '.ant-card-extra': {
        marginInlineStart: 'unset'
      }
    },
    '.ant-card-cover': {
      padding: '10px',
      flex: '1 1 auto'
    },
    img: {
      maxWidth: '80%',
      margin: 'auto'
    }
  }),
  postLayout: css({
    fontSize: 16
  }),
  postTitle: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',

    img: {
      width: '300px'
    }
  }),
  postContent: css({
    maxWidth: '900px',
    margin: 'auto'
  })
}

export default style
