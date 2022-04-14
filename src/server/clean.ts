import { stopdB } from '@/database'

/**
 * Clean
 */
const clean = async (): Promise<void> => {
  await stopdB()
}

export default clean
