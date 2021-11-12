import WaitDB from '@/database/wait'

const add = async ({ email }) => {
  WaitDB.add({ email })
}

const Wait = { add }
export default Wait
