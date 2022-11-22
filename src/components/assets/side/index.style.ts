import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  side: css({
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    justifyItems: 'center',

    img: {
      maxWidth: '100%'
    }
  }),
  right: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  }),
  left: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  }),
  top: css({
    position: 'absolute',
    width: '80%',
    top: 'calc(100% - 40px)'
  })
}

export default style
