import { stopdB } from '@/database'

const clean = async () => {
  await stopdB()
}

export default clean
