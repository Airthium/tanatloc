/** @module src/lib/template */

import ejs from 'ejs'

import { readFile, writeFile } from './tools'

const render = async (file, parameters, save) => {
  // Render
  const script = await ejs.renderFile(file, parameters)

  // Save
  if (save) await writeFile(save.location, save.name, script)

  // Return
  return script
}

export { render }
