import { useState } from 'react'
import AceEditor from 'react-ace'

export default function FreefemCode() {
  const [code, setCode] = useState('FreeFem Editor')
  const onChange = (newCode: string): void => {
    setCode(newCode)
  }
  return (
      <AceEditor
        width="100%"
        value={code}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true, $showPrintMargin:false }}
        onChange={onChange}
      />
  )
}
