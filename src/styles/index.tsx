import { css, SerializedStyles } from '@emotion/react'

export const variables = {
  colorPrimary: '#fad114',
  colorLink: '#ee9817',
  textColor: '#1f1f1f',
  textColorDark: 'rgba(0, 0, 0, 0.65)',
  textColorLight: 'rgba(0, 0, 0, 0.45)'
}

export const globalStyle: {
  [key: string]: SerializedStyles
} = {
  logo: css({
    padding: '20px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variables.colorPrimary,
    height: '64px'
  }),
  displayNone: css({
    display: 'none !important'
  }),
  fullWidth: css({
    width: '100% !important'
  }),
  noScroll: css({
    maxHeight: '100% !important',
    overflow: 'hidden !important'
  }),
  scroll: css({
    maxHeight: '100% !important',
    overflow: 'auto !important'
  }),
  noBackground: css({
    background: 'none !important',
    backgroundColor: 'none !important'
  }),
  noBorder: css({
    border: 'none !important',
    boxShadow: 'none !important'
  }),
  textLight: css({
    color: variables.textColorLight + ' !important'
  }),
  textDark: css({
    color: variables.textColorDark + ' !important'
  }),
  textOrange: css({
    color: 'orange !important'
  }),
  textGreen: css({
    color: 'green !important'
  })
}

export const globalStyleFn: {
  [key: string]: (...args: any) => SerializedStyles
} = {
  margin: (size: number) =>
    css({
      margin: size + 'px'
    }),
  marginTop: (size: number) =>
    css({
      marginTop: size + 'px'
    }),
  marginRight: (size: number) =>
    css({
      marginRight: size + 'px'
    }),
  marginBottom: (size: number) =>
    css({
      marginBottom: size + 'px'
    }),
  marginLeft: (size: number) =>
    css({
      marginLeft: size + 'px'
    }),
  padding: (size: number) =>
    css({
      padding: size + 'px'
    }),
  paddingTop: (size: number) =>
    css({
      paddingTop: size + 'px'
    }),
  paddingRight: (size: number) =>
    css({
      paddingRight: size + 'px'
    }),
  paddingBottom: (size: number) =>
    css({
      paddingBottom: size + 'px'
    }),
  paddingLeft: (size: number) =>
    css({
      paddingLeft: size + 'px'
    })
}
