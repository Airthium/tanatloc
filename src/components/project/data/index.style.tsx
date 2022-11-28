import { variables } from '@/styles'
import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  data: css({
    position: 'absolute',
    zIndex: 100,
    right: 50,
    bottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0)'
  }),
  button: css({
    width: '40px !important',
    height: '40px',
    border: '1px solid #5E14FA',
    borderRadius: 20,
    marginBottom: -20
  }),
  container: css({
    display: 'flex',
    height: '100%',
    padding: '10px',
    justifyContent: 'space-between'
  }),
  tableContainer: css({
    display: 'flex',
    height: '100%',
    width: '49%',
    overflow: 'auto',

    '& .column': {
      '.ant-checkbox': {
        display: 'none'
      }
    },

    '.selected': {
      backgroundColor: variables.colorPrimary + '55',

      svg: {
        color: variables.colorPrimary
      }
    }
  })
}

export default style
