import {useProcessManager} from "@/manager/processManager.tsx";
import {Apps} from '@/manager/importManager.tsx';
import {TaskType} from "@/modules/typeModule.tsx";

export const MGSetHTML = (tag:string, atbt:string, start_ctnt:number, ctnt:string[]|string)=>{
  let res = `<${tag} ${atbt!=="none"?atbt.replace(',',' '):""}>`;
  if(start_ctnt>0) {
    for (let i = start_ctnt; i < ctnt.length; i++) {
      res += ctnt[i] + " ";
    }
    res += `</${tag[0]}>`
  }
  else {
    res += `${ctnt}</${tag}>`
  }
  return res;
}

const FindTask = (tasklist, target) => {
  for(let i=0;i<tasklist.length;i++){
    if(tasklist[i].name == target){
      return false;
    }
  }
  return true;
}

const GetTaskList = (tasklist:TaskType[]) =>{
  let res = "";
  for(let i=0;i<tasklist.length;i++){
    res += tasklist[i].name + " " +tasklist[i].id + " " + tasklist[i].type + "<br/>";
  }
  return res;
}

export const MGProcess = (action:number=0,target:string|undefined = undefined,tasklist, addTask, removeTask) => {
  if(action==0){
    return GetTaskList(tasklist);
  }else{
    if(action==1){
      if(!FindTask(tasklist, target)) return "이미 실행된 프로세스.";
      for (let i = 0; i < Apps.length; i++) {
        if (Apps[i].name == target) {
          addTask(Apps[i]);
        }
      }
      return "프로세스를 실행했습니다.";
    }else if(action==2){
      if(FindTask(tasklist, target)) return "실행되지 않은 프로세스.";
      for (let i = 0; i < Apps.length; i++) {
        if (Apps[i].name == target) {
          removeTask(Apps[i]);
        }
      }
      return "프로세스를 종료하였습니다.";
    }
  }
}