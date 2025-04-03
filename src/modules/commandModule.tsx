import {MGProcess, MGSetHTML} from "@/manager/MariAPIManager.tsx";
import {atom, RecoilState} from "recoil";
import {TaskType} from "@/modules/typeModule.tsx";
import {taskManager} from "@/manager/taskManager.ts";
import {useProcessManager} from "@/manager/processManager.tsx";

export const History:RecoilState<TaskType[]> = atom({
  key: 'History',
  default: [] as any
})

const GetHistory:(history:string[])=>string = (history:string[]) => {
  let res="";
  for(let i=0;i<history.length;i++){
    res += (i+1) + ": " + history[i] + "<br/>";
  }
  return res;
}



const getHelp:()=>string = () => ("html [tag] [attribute,attribute2,...] [content]<br/>" +
  "history<br/>" +
  "rm [classname or id]<br/>" +
  "task [list, exec, kill] [taskname]")

export const commandModule = (command:string,history:string[],tasklist,addTask,removeTask) => {
  let res: string = "<p>" + command + "<br/></p>";
  let splitCommand: string[] = command.split(' ');
  if (splitCommand.length >= 1) {
    if (splitCommand[0].toLowerCase() == "html") {
      res += MGSetHTML(splitCommand[1],splitCommand[2],3,splitCommand);
    }else if (splitCommand[0].toLowerCase() == "help") {
      res += getHelp();
    }else if (splitCommand[0].toLowerCase() == "history") {
      res += GetHistory(history);
    }else if (splitCommand[0].toLowerCase() == "rm") {
      const searchId = document.getElementById(splitCommand[1]);
      if(searchId){searchId.remove()}
      const searchClass = document.getElementsByClassName(splitCommand[1]);
      for(let i = 0; i < searchClass.length;) {
        searchClass[i].remove();
      }
    }else if(splitCommand[0].toLowerCase() == "task"){
      if(splitCommand[1].toLowerCase() == "list") res += MGProcess(0,undefined,tasklist,addTask,removeTask);
      else if(splitCommand[1].toLowerCase() == "exec") res += MGProcess(1,splitCommand[2],tasklist,addTask,removeTask)
      else if(splitCommand[1].toLowerCase() == "kill") res += MGProcess(2,splitCommand[2],tasklist,addTask,removeTask)
      else res += MGSetHTML("p","none",0,"command not found");
    } else{
      res += MGSetHTML("p","none",0,"command not found");
    }
  }
  return res;

}