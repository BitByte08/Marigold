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
const TerminalContent = styled.section`
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
    overflow: auto;
`
const LastCommand = styled.div`
    width: 100%;
    color: white;
    display: flex;
    margin: 0;
    padding: 0;
`

const Terminal = () =>{
  const [command,setCommand] = useState<string>("");
  const [history, Push ,Pop,] = useQueue();
  const [session, setSession] = useState<string[]>([]);
  const [isInput, setIsInput] = useState<boolean>(true);
  useEffect(() => {
    let res:string = "";
    let temp1 = command.split(' ');
    if(command == "history"){
      res = GetHistory();
    }else if(temp1.length > 1){
      if(temp1[0] == "html"){
        console.log("html");
      }else{
        res = "";
        for(let i = 0; i<temp1.length;i++){
          res+=temp1[i] + " ";
        }
      }
    }else{
      res = command;
    }
    console.log(res);
    setSession([res,...session]);
    console.log(command);
  }, [command]);
  useEffect(() => {
    if(history.length > 100){
      Pop();
    }
  },[history]);

  const GetHistory:()=>string = () => {
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
            <p style={{"padding": 0,"margin" : 0}} dangerouslySetInnerHTML={{__html: item}} key={index}/>
          </LastCommand>
      ))}
      </CommandContent>
      <Input onKeyDown={(e:any)=>{
        if(e.key==="Enter" && !e.nativeEvent.isComposing) {
          console.log(e.target.value);
          Push(e.target.value);
          setCommand(e.target.value);
          e.target.value = "";
        }
        }}></Input>
    </TerminalContent>
  )
}
export default Terminal