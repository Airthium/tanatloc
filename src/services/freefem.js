import { exec } from 'child_process'

const freefem = async (path, script) => {
  const log = await new Promise((resolve, reject) => {
    exec(
      'docker run --rm -v ' +
        path +
        ':' +
        '/run' +
        ' -w /run' +
        ' -u $(id -u):$(id -g) freefem/freefem:latest FreeFem++ ' +
        script,
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr })
        resolve(stdout + '\n' + stderr)
      }
    )
  })

  return log
}

export default freefem
