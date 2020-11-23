/** @module src/lib/template */

import ejs from 'ejs'

import { readFile, writeFile } from './tools'

const render = async (file, parameters, save) => {
  // Render
  let script
  // try {
  script = await ejs.renderFile(file, parameters)
  // } catch (err) {
  //   console.log(err)
  // }

  // Save
  if (save) await writeFile(save.location, save.name, script)

  // Return
  return script
}

export { render }
