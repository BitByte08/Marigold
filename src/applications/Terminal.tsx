import {useEffect, useState} from "react";
import {styled} from "styled-components";
import {useRecoilQueue} from "@/modules/dataStructureModule.tsx";
import {atom, RecoilState} from "recoil";
import {TaskType} from "@/modules/typeModule.tsx";
import {commandModule, History} from "@/modules/commandModule.tsx";




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
  const [session, setSession] = useState<string[]>([]);
  useEffect(() => {
    if(!first) {
      const res:string = commandModule(command,history);
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
        console.log(item + " " + index);
        return(
        <LastCommand key={index} >
          <div style={{"padding": 0, "margin": 0, "width": "100%"}} dangerouslySetInnerHTML={{__html: item}} key={index}/>
        </LastCommand>
        )
      }):(<></>)}
      </CommandContent>
      <InputContainer>
      <p>{">"}</p><Input onKeyDown={(e:any)=>{
        if(e.key==="Enter" && !e.nativeEvent.isComposing) {
          console.log(e.target.value);
          Push(e.target.value);
          setCommand(e.target.value);
          e.target.value = "";
        }
        }}></Input>
      </InputContainer>
    </TerminalContent>
  )
}
export default Terminal