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
 * @param {Object} props Props
 */
const PasswordItem = ({
  name,
  label,
  inputPlaceholder,
  inputAutoComplete,
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
        { required: true, message: errors.password },
        {
          min: system?.password?.min || 6,
          message: errors.passwordTooSmall
        },
        {
          max: system?.password?.max || 16,
          message: errors.passwordTooLong
        },
        {
          pattern: system?.password?.requireLetter && /^(?=.*[a-zA-Z])/,
          message: errors.passwordRequireLetter
        },
        {
          pattern: system?.password?.requireNumber && /^(?=.*[0-9])/,
          message: errors.passwordRequireNumber
        },
        {
          pattern:
            system?.password?.requireSymbol && /[!@#$%^&*(){}[\]<>?/|.:;_-]/,
          message: errors.passwordRequireSymbol
        }
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

export default PasswordItem
