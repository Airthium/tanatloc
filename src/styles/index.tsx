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
  displayFlex: css({
    display: 'flex !important'
  }),
  fullWidth: css({
    width: '100% !important'
  }),
  fullHeight: css({
    height: '100% !important'
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
  noBorderBottom: css({
    borderBottom: 'none !important',
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
  }),
  textAlignLeft: css({
    textAlign: 'left !important' as 'left'
  }),
  textAlignCenter: css({
    textAlign: 'center !important' as 'center'
  })
}

export const globalStyleFn: {
  [key: string]: (...args: any) => SerializedStyles
} = {
  margin: (size: number | string) =>
    css({
      margin: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  marginTop: (size: number | string) =>
    css({
      marginTop: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  marginRight: (size: number | string) =>
    css({
      marginRight: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  marginBottom: (size: number | string) =>
    css({
      marginBottom: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  marginLeft: (size: number | string) =>
    css({
      marginLeft: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  padding: (size: number | string) =>
    css({
      padding: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  paddingTop: (size: number | string) =>
    css({
      paddingTop: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  paddingRight: (size: number | string) =>
    css({
      paddingRight: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  paddingBottom: (size: number | string) =>
    css({
      paddingBottom: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  paddingLeft: (size: number | string) =>
    css({
      paddingLeft: size === 'auto' ? size : size + 'px' + ' !important'
    }),
  maxWidth: (size: number | string) =>
    css({
      maxWidth: typeof size === 'string' ? size : size + 'px' + ' !important'
    })
}
