import { spawn } from 'child_process'

const freefem = async (path, script) => {
  const code = await new Promise((resolve, reject) => {
    const process = spawn('docker', [
      'run',
      '--rm',
      '-v=' + path + ':/run',
      '-w=/run',
      'freefem/freefem:latest',
      'FreeFem++',
      script
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

export default freefem
