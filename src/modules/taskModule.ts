import {atom, RecoilState} from 'recoil'
import {TaskType} from '@/modules/typeModule.tsx'

const taskModule:RecoilState<TaskType[]> = atom({
  key: 'taskModule',
  default: [] as any
})

export {taskModule}