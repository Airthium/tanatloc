import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

import SystemAPI from '@/api/system'

const errors = {
  password: 'Please enter a password',
  passwordTooSmall: 'Your password is too small',
  passwordTooLong: 'Your password is too long',
  passwordRequireLetter: 'Your password must contain a letter',
  passwordRequireNumber: 'Your password must contain a number',
  passwordRequireSymbol: 'Your password must contain a symbol'
}

/**
 * Password item
 * @memberof module:components/assets/input
 * @param {Object} props Props
 */
const PasswordItem = ({
  name,
  label,
  inputPlaceholder,
  inputAutoComplete,
  edit,
  style
}) => {
  // Data
  const [system] = SystemAPI.useSystem()

  /**
   * Render
   */
  return (
    <Form.Item
      name={name || 'password'}
      label={label || 'Password'}
      rules={[
        () => ({
          validator(_, value) {
            if (!value) return Promise.reject(new Error(errors.password))

            if (edit && value === '******') return Promise.resolve()

            if (value.length < (system?.password?.min || 6))
              return Promise.reject(new Error(errors.passwordTooSmall))

            if (value.length > (system?.password?.max || 16))
              return Promise.reject(new Error(errors.passwordTooLong))

            if (system?.password?.requireLetter)
              if (value.search(/[a-zA-Z]/) === -1)
                return Promise.reject(new Error(errors.passwordRequireLetter))

            if (system?.password?.requireNumber)
              if (value.search(/[0-9]/) === -1)
                return Promise.reject(new Error(errors.passwordRequireNumber))

            if (system?.password?.requireSymbol)
              if (value.search(/[!@#$%^&*(){}[\]<>?/|.:;_-]/) === -1)
                return Promise.reject(new Error(errors.passwordRequireSymbol))

            return Promise.resolve()
          }
        })
      ]}
      style={style}
    >
      <Input.Password
        placeholder={inputPlaceholder}
        autoComplete={inputAutoComplete}
      />
    </Form.Item>
  )
}

PasswordItem.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputAutoComplete: PropTypes.string,
  edit: PropTypes.bool,
  style: PropTypes.object
}

export default PasswordItem
