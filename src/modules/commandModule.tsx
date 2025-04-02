import {MGSetHTML} from "@/manager/MariAPIManager.tsx";
import {atom, RecoilState, useRecoilValue} from "recoil";
import {TaskType} from "@/modules/typeModule.tsx";
import {useRecoilQueue} from "@/modules/dataStructureModule.tsx";

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
  "rm [classname or id]<br/>")

export const commandModule = (command:string,history:string[]) => {
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
    }else{
      res += MGSetHTML("p","none",0,"command not found");
    }
  }
  return res;

}