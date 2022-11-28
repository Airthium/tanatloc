import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  header: css({
    background: 'white !important',
    paddingInline: '0 !important'
  }),
  content: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',

    '& > *': {
      width: '30%'
    }
  })
}

export default style
