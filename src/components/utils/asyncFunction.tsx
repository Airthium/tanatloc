export const asyncFunctionExec = (callback: () => Promise<void>): void => {
  callback().catch(console.error)
}
