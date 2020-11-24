import { exec } from 'child_process'

const gmsh = async (path, fileIn, fileOut) => {
  const log = await new Promise((resolve, reject) => {
    exec(
      'docker run --rm -v ' +
        path +
        ':' +
        '/mesh' +
        ' -w /mesh' +
        ' -u $(id -u):$(id -g) tanatloc/converters:latest gmsh ' +
        ' -3 ' +
        fileIn +
        ' -o ' +
        fileOut +
        ' -format msh2',
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr })
        resolve(stdout + '\n' + stderr)
      }
    )
  })

  return log
}

export default gmsh
