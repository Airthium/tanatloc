import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

export interface IProps {
  children?: ReactChild | ReactChild[]
  onClick: () => void
}

/**
 * Go back
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - children (React node) Button children (default to 'Go back')
 * - onClick (Function) Button click
 */
const GoBack = ({ children, onClick }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Button
      className="no-border"
      icon={<ArrowLeftOutlined className="color-primary" />}
      onClick={onClick}
    >
      {children || 'Go back'}
    </Button>
  )
}

GoBack.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired
}

export default GoBack
