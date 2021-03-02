import { useState } from 'react'
import { Input, Tag } from 'antd'

const EmailsInput = () => {
  // State
  const [emails, setEmails] = useState([])
  const [value, setValue] = useState('')

  /**
   * On change
   * @param {Object} event Event
   */
  const onChange = (event) => {
    let text = event.target.value

    const lastChar = text[text.length - 1]
    if (lastChar === ' ' || lastChar === ',') {
      const newEmails = extractEmails(text)

      if (newEmails?.length) {
        setEmails([...emails, ...newEmails])

        // Remove emails from text
        newEmails.forEach((email) => {
          text = text.replace(email, '')
        })

        // Remove last char from text
        const index = text.lastIndexOf(lastChar)
        text = text.substring(0, index)

        setValue(text)
        return
      }
    }

    setValue(text)
  }

  /**
   * Extract emails
   * @param {string} text Text
   */
  const extractEmails = (text) => {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
  }

  /**
   * On close
   * @param {number} index Index
   */
  const onClose = (index) => {
    const newEmails = emails.filter((e, i) => i !== index)
    setEmails(newEmails)
  }

  /**
   * Render
   */
  return (
    <>
      {emails.map((email, index) => (
        <Tag key={index} closable={true} onClose={() => onClose(index)}>
          {email}
        </Tag>
      ))}
      <Input disabled={true} value={value} onChange={onChange} />
    </>
  )
}

export default EmailsInput
