import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  view: css({
    width: '100%',
    height: '100%'
  }),
  head: css({
    position: 'absolute',
    top: '160px',
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent !important',
    zIndex: 10,
    height: 'calc(100% - 160px)',
    padding: '0 57px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    alignItems: 'center'
  }),
  content: css({
    width: '100%',
    height: '100%',
    position: 'relative'
  }),
  loading: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(128, 128, 118, 0.1)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  canvas: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  })
}

export default style
