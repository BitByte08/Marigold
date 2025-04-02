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
`;
const CommandContent = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column-reverse;
    width: 100%;
    overflow: auto;
`;
const LastCommand = styled.div`
    width: 100%;
    color: white;
    display: flex;
    margin: 0;
    padding: 0;
`;

const Terminal = () =>{
  const [first, setFirst] = useState(true);
  const [command,setCommand] = useState<string>();
  const [history, Push ,Pop,Top] = useQueue();
  const [session, setSession] = useState<string[]>([]);
  useEffect(() => {
    if(!first) {
      let res: string = "<p>" + Top() + "<br/></p>";
      let splitCommand: string[] = Top().split(' ');
      if (command == "history") {
        res = GetHistory();
      } else if (splitCommand.length > 1) {
        if (splitCommand[0] == "html") {
          res += `<${splitCommand[1]}>`;
          for (let i = 2; i < splitCommand.length; i++) {
            res += splitCommand[i] + " ";
          }
          res += `</${splitCommand[1]}>`
        } else {
          for (let i = 0; i < splitCommand.length; i++) {
            res += splitCommand[i] + " ";
          }
        }
      } else {
        res += "<p>command not found</p>";
      }
      console.log(res);
      setSession([res, ...session]);
      console.log(session);
    }
    setFirst(false);
  }, [command]);
  useEffect(() => {
    if(history.length > 100){
      Pop();
    }
  },[command]);

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
      {session ? session.map((item,index)=> {
        console.log(item + " " + index);
        return(
        <LastCommand key={index} >
          <div style={{"padding": 0, "margin": 0, "width": "100%"}} dangerouslySetInnerHTML={{__html: item}} key={index}/>
        </LastCommand>
        )
      }):(<></>)}
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