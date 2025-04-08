import {TaskType} from '../modules/typeModule.tsx'
import {useRecoilState} from "recoil";
import {taskModule} from "@/modules/taskModule.ts";
import {Apps} from "@/manager/importManager.tsx";

//프로세스 관리 훅
//기본 제공 기능
//- 프로세스 추가
//- 프로세스 삭제
const FindTask = (tasklist:TaskType[], target:string|undefined = undefined) => {
  for(let i=0;i<tasklist.length;i++){
    if(tasklist[i].name.toLowerCase() == target?.toLowerCase()){
      return false;
    }
  }
  return true;
}

const useProcessManager: () => [TaskType[], (name: string) => boolean, (name: string) => boolean] = () => {
  const [taskList, setTaskList] = useRecoilState<TaskType[]>(taskModule);
  const addTask = (component:TaskType) => {
    setTaskList(Task => (!Task.includes(component))?
      [...Task, component]:[...Task])
  };
  const removeTask = (component:TaskType) => {
    setTaskList(Task => (Task.some(item => item.name === component.name)) ?
      Task.filter(item => item.name !== component.name) : [...Task])
  };
  const addTaskAsName = (name: string) => {
    if (!FindTask(taskList, name)) return false;
    for (let i = 0; i < Apps.length; i++) {
      if (Apps[i].name.toLowerCase() == name?.toLowerCase()) {
        addTask(Apps[i]);
      }
    }
    return true;
  }
  const removeTaskAsName = (name: string) => {
    if(FindTask(taskList, name)) return false;
    for (let i = 0; i < Apps.length; i++) {
      if (Apps[i].name.toLowerCase() == name?.toLowerCase()) {
        removeTask(Apps[i]);
      }
    }
    return true;
  }

  return [taskList, addTaskAsName, removeTaskAsName];
}

export {useProcessManager};