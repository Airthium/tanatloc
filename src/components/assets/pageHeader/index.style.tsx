import { variables } from '@/styles'
import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  head: css({
    display: 'flex',
    justifyContent: 'space-between',

    '& div:last-child': {
      padding: '16px 0'
    }
  }),
  divider: css({
    borderColor: variables.colorPrimary,
    margin: '12px 0'
  })
}

export default style
