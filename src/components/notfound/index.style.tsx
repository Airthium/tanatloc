import { css, SerializedStyles } from '@emotion/react'
import { variables } from '@/styles'

export const mediaQuery = `@media all and (max-width: 1100px)`

const style: { [key: string]: SerializedStyles } = {
  index: css({
    display: 'block',
    width: '100%',
    height: '95%',
    overflow: 'auto',
    overflowX: 'hidden',
    padding:'0 100px',

    [mediaQuery]: {
      padding: '0 20px !important'
    }
  }),
  content: css({
    width: '100%',
    height: '100%',
    overflow: 'auto',
    overflowX: 'hidden',
    backgroundColor:'#fad114',
    marginRight:"-100px"
  })
}

export default style
