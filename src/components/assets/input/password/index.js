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
 *
 * Props:
 * - name: Name of the form item (default: 'password')
 * - label: Label of the form item (default: 'Password')
 * - inputPlaceholder: Input placeholder (default: none)
 * - inputAutoComplete: Input autocomplete (default: none)
 * - edit: Allow '******' as a valid password for editing purpose (default: false)
 * - style: Style of the form item (default: none)
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
   * Check regex
   * @param {string} value Value
   * @param {RegExp} regex Regex
   */
  const checkRegex = (value, regex) => {
    if (value.search(regex) === -1) return false
    return true
  }

  /**
   * Require letter
   * @param {string} value Value
   */
  const requireLetter = (value) => {
    if (system?.password?.requireLetter) return checkRegex(value, /[a-zA-Z]/)
    return true
  }

  /**
   * Require number
   * @param {string} value Value
   */
  const requireNumber = (value) => {
    if (system?.password?.requireNumber) return checkRegex(value, /[0-9]/)
    return true
  }

  /**
   * Require symbol
   * @param {string} value Value
   */
  const requireSymbol = (value) => {
    if (system?.password?.requireNumber)
      return checkRegex(value, /[!@#$%^&*(){}[\]<>?/|.:;_-]/)
    return true
  }

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
            else {
              const err = []
              if (edit && value === '******') return Promise.resolve()

              if (value.length < (system?.password?.min || 6))
                err.push(errors.passwordTooSmall)

              if (value.length > (system?.password?.max || 16))
                err.push(errors.passwordTooLong)

              if (!requireLetter(value)) err.push(errors.passwordRequireLetter)

              if (!requireNumber(value)) err.push(errors.passwordRequireNumber)

              if (!requireSymbol(value)) err.push(errors.passwordRequireSymbol)

              if (err.length) return Promise.reject(new Error(err.join(' - ')))
              else return Promise.resolve()
            }
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
