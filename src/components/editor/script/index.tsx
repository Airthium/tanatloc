import { useEffect, useState } from 'react'
import SimpleEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import '../prism/prism-freefem.js'
import 'prism-themes/themes/prism-vs.css'

import { IConfiguration } from '..'

interface IProps {
  configuration: IConfiguration
}

const EndOfHeaderTag = '// == END OF HEADER =='

/**
 * Script
 * @param props Props
 */
const Script = ({ configuration }: IProps): JSX.Element => {
  const [code, setCode]: [string, Function] = useState('')

  useEffect(() => {
    let header = ''
    if (configuration.name) header += `// Name: ${configuration.name}\n`
    if (configuration.category)
      header += `// Category: ${configuration.category}\n`

    header += '\n// DEFAULT VARIABLES\n'
    header += '// - appendLog(string) (func)\n'
    header += '// - appendError(string) (func)\n'
    header += '// - meshN (mesh or mesh3)\n'
    header += '// - intN (int2d or int3d)\n'
    header += '// - intN1 (int1d or int2d)\n'

    if (configuration.geometry) {
      header += '\n// GEOMETRY\n'
      if (configuration.geometry.meshable)
        header += `// - ${configuration.geometry.name} (meshN)\n`
      else header += `// - ${configuration.geometry.name} (string)\n`
    }

    if (configuration.materials) {
      header += '\n// MATERIALS\n'

      configuration.materials.children?.forEach((material) => {
        header += `// - ${material.label} (real)\n`
      })
    }

    if (configuration.parameters) {
      header += '\n// PARAMETERS\n'

      Object.keys(configuration.parameters).forEach((key) => {
        const parameter = configuration.parameters[key]
        parameter.children.forEach((p, index) => {
          header += `// - ${p.label} (user defined type)\n`
          header += `//   <%= parameters.${key}.children[${index}].value ?? parameters.${key}.children[${index}].default %>\n`
        })
      })
    }

    if (configuration.initialization) {
      header += '\n// INITIALIZATION\n'
    }

    if (configuration.boundaryConditions) {
      header += '\n// BOUNDARY CONDITIONS\n'

      Object.keys(configuration.boundaryConditions).forEach((key) => {
        const boundaryCondition = configuration.boundaryConditions[key]
        header += `// - ${boundaryCondition.label} (JS array)\n`
        header += `//   <%= boundaryConditions.${key}.values || [] %>\n`

        boundaryCondition.children.forEach((b, index) => {
          header += `//   ${b.label}: <%= boundaryConditions.${key}.values[${index}].value ?? boundaryConditions.${key}.values[${index}].default %>\n`
        })
      })
    }

    header += `\n${EndOfHeaderTag}`

    const headerPos = code.lastIndexOf(EndOfHeaderTag)
    const newCode = code.slice(headerPos + EndOfHeaderTag.length)

    setCode(header + newCode)
  }, [configuration])

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
