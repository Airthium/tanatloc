import { ThemeConfig } from 'antd/es/config-provider/context'

import { variables } from './global'

const theme: ThemeConfig = {
  token: {
    colorPrimary: variables.colorPrimary,
    fontFamily: 'Saira',
    borderRadius: 0,
    colorText: variables.textColor
  }
}

export default theme
