import {create} from "zustand/react";
import {TaskType} from '@/modules/typeModule.tsx'

interface TaskListInterface {
  TaskList: TaskType[];
  addTask: (component: TaskType) => void;
  removeTask: (component: TaskType) => void;
}

const useTaskListStore = create<TaskListInterface>(set=>(
  {
    TaskList: [],
    addTask: (component: TaskType) => {
      set(state => ({
        TaskList: ((!state.TaskList.includes(component)) ? [...state.TaskList, component] : [...state.TaskList])
      }))
    },
    removeTask: (component: TaskType) => {
      set(state => ({
        TaskList: ((state.TaskList.some(item => item.name === component.name)) ?
          state.TaskList.filter(item => item.name !== component.name) : [...state.TaskList])
      }))
    }
  }
))

export {useTaskListStore}