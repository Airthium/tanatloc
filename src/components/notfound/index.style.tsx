import { css, SerializedStyles } from '@emotion/react'
import { variables } from '@/styles'

export const mediaQuery = `@media all and (max-width: 1100px)`

const style: { [key: string]: SerializedStyles } = {
  index: css({
    display: 'block',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: variables.colorPrimary
  }),
  content: css({
    width: '100%',
    height: '100%'
  }),
  title: css({
    position: 'absolute',
    zIndex: 1,
    color: '#fff',
    fontSize: '20rem',
    lineHeight: '15rem',
    fontWeight: 'bold',
    textShadow: '2px 2px rgba(0, 0, 0, 0.5)'
  }),
  three: css({
    width: '100%',
    height: '100%',
    zIndex: 0
  }),
  description: css({
    zIndex: 2,
    position: 'absolute',
    width: '100%',
    bottom: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  descriptionButton: css({
    fontSize: '24px',
    height: '48px',
    margin: 'auto',
    marginTop: '24px',
    fontWeight: 'bold'
  })
}

export default style
