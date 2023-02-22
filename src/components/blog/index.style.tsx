import { css, SerializedStyles } from '@emotion/react'

import { variables, mediaQuery } from '@/styles'

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
    },
    [mediaQuery]: {
      flexDirection: 'column',
      padding: '10px 20px',
      height: 'unset !important',
      marginBottom: '0 !important',

      '.ant-typography': {
        marginTop: -25,
        fontSize: 50,
        color: variables.colorPrimary
      }
    }
  }),
  logo: css({
    padding: '20px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '64px',
    cursor: 'pointer',
    [mediaQuery]: {
      padding: '10px 8px'
    }
  }),
  content: css({
    padding: '0 50px 50px 50px',
    [mediaQuery]: {
      padding: '10px'
    }
  }),
  contentTools: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: '10px',
    '> div:first-of-type': {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
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
    padding: '20px',
    [mediaQuery]: {
      gridTemplateColumns: '1fr'
    }
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
    },
    [mediaQuery]: {
      flexDirection: 'column'
    }
  }),
  postContent: css({
    maxWidth: '900px',
    margin: 'auto'
  })
}

export default style
