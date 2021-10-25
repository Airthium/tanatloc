import { useState } from 'react'
import SimpleEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import '../prism/prism-freefem.js'
import 'prism-themes/themes/prism-vs.css'

const Script = () => {
  const [code, setCode] = useState('')

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 20px)',
        overflow: 'auto',
        border: '1px solid gray'
      }}
    >
      <SimpleEditor
        value={code}
        onValueChange={(c) => setCode(c)}
        highlight={(c) => highlight(c, languages.freefem)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          height: '100%'
        }}
      />
    </div>
  )
}

export default Script
