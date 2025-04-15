import {useEffect, useState, Suspense, lazy} from 'react';
import styled from "styled-components";
import Observer from "../applications/utility/Observer.tsx";
import {useProcessManager} from "./processManager.tsx";
import {TaskType} from "../modules/typeModule.tsx";
import {DisplayDriver} from "@/drivers/displayDriver.tsx";
const Application = lazy(()=> import('../applications/application.tsx'));


const TaskBar = styled.footer`
    position: sticky;
    bottom: 0;
    width: inherit;
    height: 3.75rem;
    z-index: 998;
    opacity: 0.8;
    background-color: #3A3A3A;
    border-top: 1px solid #575757;
`;
const TaskList = styled.ul`
    margin:0;
    padding: 0;
    height: 100%;
    width: 100%;
    list-style: none;
    display: flex;
    align-content: center;
`;
const TaskButton = styled.button`
    height: 100%;
    border: 1px solid #575757;
    background-color: transparent;
    border-radius: 5px;
    padding: 0 20px;
    color: white;
`;

const TaskSelectButton = styled.button`
    height: 100%;
    border: 1px solid #575757;
    background-color: #1D1D1D;
    padding: 0 20px;
    border-radius: 5px;
    color: white;
`

const WindowManager = () => {
  const taskButtonStyle = {
    height: "100%",
    border: "1px"
  };
  const taskSelectButtonStyle = {
    height: "100%",
    backgroundColor:"seagreen"
  }
  const taskStyle = { margin: "0.25rem" };

  let cursor:any = null;
  const [cursorVec, setCursorVec] = useState<string[]>(["0","0"]);  //보정 후 커서 위치
  const [mouseBeacon, setMouseBeacon] = useState<number[]>([0,0]); //마우스 절대 위치
  const [layer, setLayer] = useState<number>(1);  //최대 레이어
  const [focus, setFocus] = useState<string>("Discover"); //최대 레이어를 사용중인 애플리케이션
  const [taskList, addTask, removeTask] = useProcessManager();
  const [startOption, setStartOption] = useState<boolean>(false);
  const [backUpFocus, setBackUpFocus] = useState(focus);
  const [tabDownInterrupt, setTabDownInterrupt] = useState("empty");

  useEffect(() => {
    if(focus!=="Observer"){
      setStartOption(false);
    }
  },[focus])
  useEffect(()=>{ //초기 기본 설정
    setTimeout(()=>{ //Discover 실행
      addTask("discover")
    }, 200)

    const container:HTMLElement = document.getElementById("display") as HTMLElement; // 화면 기준을 컨테이너로 설정
    cursor = document.getElementById("cursor"); // 커서 불러오기

    // 컨테이너의 위치 및 크기
    const bounds = container.getBoundingClientRect();
    document.addEventListener("mousemove", (event:MouseEvent) => {
      let x = event.clientX - bounds.x;
      let y = event.clientY - bounds.y;
        // 컨테이너 내부에만 커서를 제한
      x = Math.max(0, Math.min(bounds.width - 5, x));
      y = Math.max(0, Math.min(bounds.height - 5 , y));

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;

      setMouseBeacon([event.clientX, event.clientY]);
      setCursorVec([`${x}`,`${y}`]);
    });
  },[])

  

  return(
    <DisplayDriver>
      <Suspense fallback={null}>
          <div id="cursor"></div>
              {
                taskList.map((task:TaskType) => {
                  return (
                    <Application key={task.name}
                                 name={task.name}
                                 uid={task.id}
                                 type={task.type}
                                 appSetup={task.appSetup}
                                 layer={layer}
                                 focus={focus}
                                 taskList={taskList}
                                 cursorVec={cursorVec}
                                 tabDownInterrupt={tabDownInterrupt}
                                 setLayer={setLayer}
                                 setFocus={setFocus}
                                 setTabDownInterrupt={setTabDownInterrupt}
                                 removeTask={removeTask}
                                 removeCompnent={task}
                                 mouseBeacon={mouseBeacon}
                    >{task.component}</Application>
                  )
                })
              }
              {startOption? <Observer />:<></>}
          <TaskBar>
            <TaskList>
                  {
                    taskList.map((task) => {
                      if(task.type==="Shell") {
                        return(
                          <li style={taskStyle} key={"Observer"}>
                            <button style={startOption?taskSelectButtonStyle:taskButtonStyle}
                                    onClick={()=>{
                                      setStartOption(!startOption);
                                      if(startOption){
                                        setFocus(backUpFocus);
                                      }else {
                                        setBackUpFocus(focus);
                                        setFocus("Observer");
                                      }
                                    }
                            }>Start</button>
                          </li>
                        )
                      } else {
                        if (task.name === focus) {
                          return (
                            <li style={taskStyle} key={task.name}>
                            <TaskSelectButton onClick={() => {
                              setTabDownInterrupt(task.name);
                              }}>{task.name}</TaskSelectButton>
                            </li>
                          )
                        } else {
                          return (
                            <li style={taskStyle} key={task.name}>
                              <TaskButton onClick={() => {
                                setFocus(task.name);
                              }}>{task.name}</TaskButton>
                            </li>
                          )
                        }
                      }
                    })
                  }
            </TaskList>
          </TaskBar>
      </Suspense>
    </DisplayDriver>
  )
}
export default WindowManager;