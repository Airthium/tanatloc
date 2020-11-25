import { spawn } from 'child_process'

const gmsh = async (path, fileIn, fileOut) => {
  const code = await new Promise((resolve, reject) => {
    const process = spawn('docker', [
      'run',
      '-v=' + path + ':/mesh',
      '-w=/mesh',
      'tanatloc/converters:latest',
      'gmsh',
      '-3',
      fileIn,
      '-o',
      fileOut,
      '-format',
      'msh2'
    ])

    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    process.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    process.on('close', (code) => {
      resolve(code)
    })

    process.on('error', (err) => {
      reject(err)
    })
  })

  return code
}

export default gmsh
