import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  password: css({
    margin: 'auto !important',
    width: '350px'
  }),
  submit: css({
    marginTop: '32px',

    button: {
      width: '100%'
    }
  })
}

export default style
