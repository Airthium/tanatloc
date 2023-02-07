import { variables } from '@/styles'
import { css, SerializedStyles } from '@emotion/react'

const style: { [key: string]: SerializedStyles } = {
  header: css({
    position: 'sticky',
    top: '0',
    zIndex: 10,
    padding: '20px 120px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white !important',
    marginBottom: '20px',
    boxShadow: '0px 0px 28px 8px rgba(0, 0, 0, 0.05)',
    '.ant-typography': {
      margin: 0,
      marginLeft: '20px',
      marginRight: 'auto'
    }
  }),
  github: css({
    height: '32px',
    display: 'flex',
    img: {
      height: '32px'
    }
  }),
  logo: css({
    padding: '20px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '64px',
    cursor: 'pointer'
  }),
  sider: css({
    background: 'none !important',
    padding: '0 20px 50px 20px'
  }),
  content: css({
    padding: '0 50px 50px 50px'
  }),
  text: css({
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',

    img: {
      height: '16px'
    }
  }),
  tips: css({
    display: 'inline-block',
    position: 'relative',
    backgroundColor: variables.colorPrimary + '22',
    boxShadow: '2px 2px 5px ' + variables.colorPrimary,
    marginTop: '10px',
    padding: '40px 20px 20px 20px',
    marginRight: 'auto',

    '::before': {
      position: 'absolute',
      top: 10,
      fontWeight: 'bold',
      color: variables.colorPrimary,
      content: '"Tips"'
    }
  }),
  warnings: css({
    display: 'inline-block',
    position: 'relative',
    backgroundColor: '#FC8C7922',
    boxShadow: '2px 2px 5px #FC8C79',
    marginTop: '10px',
    padding: '40px 20px 20px 20px',
    marginRight: 'auto',

    '::before': {
      position: 'absolute',
      top: 10,
      fontWeight: 'bold',
      color: '#FC8C79',
      content: '"Warning"'
    }
  }),
  downloadButton: css({
    width: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',

    img: {
      marginRight: 10
    }
  })
}

export default style
