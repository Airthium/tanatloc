import { css, SerializedStyles } from '@emotion/react'

import { variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  error: css({
    background: variables.colorPrimary,
    padding: '50px'
  })
}

export default style
