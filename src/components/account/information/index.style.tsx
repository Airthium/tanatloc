import { css } from '@emotion/react'

const style = {
  information: css({
    display: 'flex',

    '& > div:first-child': {
      display: 'flex',
      justifyContent: 'center',
      width: '300px',

      '> div': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

        '> span:first-of-type': {
          marginBottom: '10px'
        }
      }
    },

    '& > div:last-of-type': {
      flex: '1 1 auto'
    }
  })
}

export default style
