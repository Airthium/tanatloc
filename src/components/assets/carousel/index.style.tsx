import { css, SerializedStyles } from '@emotion/react'

import { variables } from '@/styles'

const style: { [key: string]: SerializedStyles } = {
  carouselContainer: css({
    position: 'relative'
  }),
  carousel: css({
    position: 'relative',
    width: '50%'
  }),
  fullCaroussel: css({
    position: 'absolute',
    width: '100%',
    top: 0
  }),
  figure: css({
    boxShadow: '2px 2px 5px #ccc',
    img: {
      maxWidth: '100%'
    },
    figcaption: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      background: '#ccc',
      '::before': {
        margin: '0 10px',
        color: '#fff',
        content: '"Figure:"'
      }
    }
  }),
  oneImage: css({
    position: 'relative'
  }),
  displayCount: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    color: '#ccc',
    opacity: '1',
    transition: 'all 2s linear'
  }),
  noDisplayCount: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    color: '#ccc',
    opacity: '0',
    transition: 'all 2s linear'
  }),
  zoom: css({
    position: 'absolute',
    width: '100% !important',
    height: '100%',
    top: 0,
    left: 0,
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    opacity: 0.1,
    ':hover': {
      opacity: 1
    },
    svg: {
      color: variables.colorPrimary,
      fontSize: 40
    }
  }),
  previous: css({
    position: 'absolute',
    top: 0,
    left: -8,
    height: '100%',
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    svg: {
      color: variables.colorPrimary,
      fontSize: 40
    }
  }),
  next: css({
    position: 'absolute',
    top: '0',
    right: 0,
    height: '100%',
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    svg: {
      color: variables.colorPrimary,
      fontSize: 40
    }
  })
}

export default style
