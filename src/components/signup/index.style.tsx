import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  signup: css({
    margin: 'auto !important',
    width: '350px'
  }),
  submit: css({
    marginTop: '32px',

    button: {
      width: '50%'
    }
  })
}

export default style
