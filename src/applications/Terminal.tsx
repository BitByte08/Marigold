import {useEffect, useState} from "react";
import {styled} from "styled-components";
import {useQueue} from "@/modules/dataStructureModule.tsx";

const Input = styled.input`
    background-color: none;
    padding: 0;
    margin: 0;
    border: none;
    width: 100%;
    height: 2rem;
    bottom: 5px;
`;
const TerminalContent = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    background-color: black;
    height: 100%;
    width: 100%;
`
const CommandContent = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column-reverse;
    width: 100%;
    
`
const LastCommand = styled.p`
    width: 100%;
    color: white;
    display: flex;
    margin: 0;
    padding: 0;
`

const Terminal = () =>{
  const [command,setCommand] = useState("");
  const [history, Push ,Pop,] = useQueue();
  const [session, setSession] = useState<string[]>([]);
  useEffect(() => {
    let res:any;
    if(command == "history"){
      res = GetHistory();
      console.log(res);
    }else{
      res = command;
    }
    setSession([res,...session]);
    console.log(command);
  }, [command]);
  useEffect(() => {
    if(history.length > 100){
      Pop();
    }
  },[history]);

  const GetHistory:()=>string[] = () => {
    let str="";
    for(let i=0;i<history.length;i++){
      str += history[i] + "<br/>";
    }
    return str;
  }

  return (
    <TerminalContent>
      <CommandContent>
      {session.map((item,index)=>(
          <LastCommand key={index}>
            <p dangerouslySetInnerHTML={{__html: item}} />
          </LastCommand>
      ))}
      </CommandContent>
      <Input onKeyDown={(e:any)=>{
        if(e.key==="Enter") {
          setCommand(e.target.value);
          Push(e.target.value);
          e.target.value = "";
        }
        }}></Input>
    </TerminalContent>
  )
}
export default Terminal