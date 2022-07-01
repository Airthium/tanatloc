/**
 * Indent
 * @param text Text
 * @param depth Number of indent (2 spaces)
 * @returns Indented test
 */
export const indent = (text: string, depth: number): string => {
  let output = ''
  let space = ''
  for (let i = 0; i < depth; ++i) space += '\t'
  text.split('\n').forEach((line) => {
    if (line.trim()) output += space + line + '\n'
    else output += '\n'
  })

  return output
}
