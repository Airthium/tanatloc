/** @module src/lib/template */

import ejs from 'ejs'

import Tools from './tools'

/**
 * Render template
 * @param {string} file File name
 * @param {Object} parameters Parameters
 * @param {Object} save Save
 */
const render = async (file, parameters, save) => {
  // Render
  const script = await ejs.renderFile(file, parameters)

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

export default { render }
