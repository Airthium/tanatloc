import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  loading: css({
    margin: 'auto !important',
    maxWidth: '80%'
  }),
  content: css({
    maxHeight: '50vh',
    padding: '20px',
    overflow: 'auto'
  }),
  status: css({
    marginTop: '10px'
  }),
  errors: css({
    marginTop: '10px',
    color: 'red',

    '& .ant-card': {
      margin: '10px 0',
      borderColor: 'red',
      color: 'red'
    }
  })
}

export default style
