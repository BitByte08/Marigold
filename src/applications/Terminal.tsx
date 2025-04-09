import {useEffect, useState} from "react";
import {styled} from "styled-components";
import {useRecoilQueue} from "@/modules/dataStructureModule.tsx";
import {atom, RecoilState} from "recoil";
import {TaskType} from "@/modules/typeModule.tsx";
import setHTML from "@/modules/interfaceModule.tsx";
import {useProcessManager} from "@/manager/processManager.tsx";
import AppContent from "@/modules/styleModule.tsx";


const getHistory:(history:string[])=>string = (history:string[]) => {
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

const History:RecoilState<TaskType[]> = atom({
  key: 'History',
  default: [] as any
})





const Input = styled.input`
    background : none;
    padding: 0 0 0 5px;
    color: white;
    margin: 0;
    border: none;
    width: 100%;
    height: 2rem;
    bottom: 5px;
    line-height: 2rem;
    &:focus {
        outline: none;
    }
`;
const InputContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > p{
        padding: 0;
        margin: auto 0;
        height: 1rem;
        color: white;
    }
`;
const TerminalContent = styled(AppContent)`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    background-color: black;
    padding: 0 5px;
`;
const CommandContent = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column-reverse;
    width: 100%;
    overflow: auto;
`;
const LastCommand = styled.div`
    border-bottom: 1px solid gray;
    width: 100%;
    color: white;
    display: flex;
    margin: 0;
    padding: 0;
`;

const Terminal = () =>{
  const [first, setFirst] = useState(true);
  const [command,setCommand] = useState<string>("");
  const [history, Push ,Pop,] = useRecoilQueue(History);
  const [list,addTask,removeTask] = useProcessManager();
  let historyLength= history.length
  const [session, setSession] = useState<string[]>([]);
  useEffect(() => {
    if(!first) {
      let res: string = "<p>" + command + "<br/></p>";
      let splitCommand: string[] = command.split(' ');
      if (splitCommand.length >= 1) {
        if (splitCommand[0].toLowerCase() == "html") {
          res += setHTML(splitCommand[1],splitCommand[2],3,splitCommand);
        }else if (splitCommand[0].toLowerCase() == "help") {
          res += getHelp();
        }else if (splitCommand[0].toLowerCase() == "history") {
          res += getHistory(history);
        }else if (splitCommand[0].toLowerCase() == "rm") {
          const searchId = document.getElementById(splitCommand[1]);
          if(searchId){searchId.remove()}
          const searchClass = document.getElementsByClassName(splitCommand[1]);
          for(let i = 0; i < searchClass.length;) {
            searchClass[i].remove();
          }
        }else if(splitCommand[0].toLowerCase() == "task"){
          if(splitCommand[1].toLowerCase() == "list") res += list;
          else if(splitCommand[1].toLowerCase() == "exec") res += addTask(splitCommand[2])
          else if(splitCommand[1].toLowerCase() == "kill") res += removeTask(splitCommand[2])
          else res += setHTML("p","none",0,"command not found");
        } else{
          res += setHTML("p","none",0,"command not found");
        }
      }
      setSession([res, ...session]);
    }else{
      let res = "Project Marigold Terminal<br/>기본 명령어를 보려면 help를 입력하세요.";
      setSession([res, ...session]);
    }
    setFirst(false);
  }, [command]);
  useEffect(() => {
    if(history.length > 100){
      Pop();
    }
  },[command]);



  return (
    <TerminalContent>
      <CommandContent>
      {session ? session.map((item,index)=> {
        return(
        <LastCommand key={index} >
          <div style={{"padding": 0, "margin": 0, "width": "100%"}} dangerouslySetInnerHTML={{__html: item}} key={index}/>
        </LastCommand>
        )
      }):(<></>)}
      </CommandContent>
      <InputContainer>
      <p>{">"}</p><Input onKeyDown={(e:any)=>{
        setTimeout(()=>{
        if(e.key==="Enter" && !e.nativeEvent.isComposing) {
          historyLength = history.length;
          Push(e.target.value);
          setCommand(e.target.value);
          e.target.value = "";
        }else if(e.key==="ArrowUp"){
          historyLength-=(historyLength>0?1:0);
          e.target.value = `${history[historyLength]}`;
        }else if(e.key==="ArrowDown"){
          historyLength+=(historyLength<history.length-1?1:0);
          e.target.value = `${history[historyLength]}`;
        }},0);}}></Input>
      </InputContainer>
    </TerminalContent>
  )
}
export default Terminal