import { css } from '@emotion/react'

const style = {
  index: css`
    display: block;
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    padding: 0 100px;
  `,
  indexHeader: css`
    position: sticky;
    top: 0;
    z-index: 10;
    margin: 0 -100px;
    padding: 20px 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white !important;
    margin-bottom: 90px;
    box-shadow: 0px 0px 28px 8px rgba(0, 0, 0, 0.05);

    ul: {
      flex: 1 1 auto;
      justify-content: center;
      border-bottom: none;

      li: {
        padding: 0 !important;
      }
    }
  `
}

export default style
