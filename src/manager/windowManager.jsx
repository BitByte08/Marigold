import {useEffect, useState, Suspense, lazy} from 'react';
const Application = lazy(()=> import('../applications/application.jsx'));
import Discover from "../applications/discover.jsx";
import {Apps} from './importManager.jsx';
import Observer from "../applications/utility/Observer.jsx";


const WindowManager = () => {
  const displayDriver = {
    height: "100%",
    inset: 0,
    aspectRatio: "4 / 3",
    margin: "0 auto",
  };
  const taskBarStyle = {
    position: "sticky",
    bottom: 0,
    width: "inherit",
    height: "3.125rem",
    zIndex: 998,
    backgroundColor: "springgreen"
  };
  const taskListStyle = {
    margin:0,
    padding: 0,
    height: "100%",
    width: "100%",
    listStyle: "none",
    display: "flex",
    alignContent: "center"
  };
  const taskButtonStyle = {
    height: "100%",
    backgroundColor:"lightgreen"
  };
  const taskSelectButtonStyle = {
    height: "100%",
    backgroundColor:"seagreen"
  }
  const taskStyle = { margin: "0.25rem" };


  const [cursorLeft, setCursorLeft] = useState("0");
  const [cursorTop, setCursorTop] = useState("0");
  const [mouseBeacon, setMouseBeacon] = useState([]);
  const [layer, setLayer] = useState(1);
  const [focus, setFocus] = useState("Discover");
  const [taskList, setTaskList] = useState([]);
  const [startOption, setStartOption] = useState(false);
  const [backUpFocus, setBackUpFocus] = useState(focus);


  const addTask = (component) => {
    setTaskList(Task => (!Task.includes(component))?
      [...Task, component]:[...Task])
  }
  const removeTask = (component) => {
    setTaskList(Task => (Task.some(item => item.name === component.name)) ?
      Task.filter(item => item.name !== component.name) : [...Task])
  }
  let cursor = null;
  useEffect(() => {
    if(focus!=="Discover"){
      setStartOption(false);
    }
  },[focus])

  useEffect(()=>{
    setTimeout(()=>{
      setTaskList(Temp=> [...Temp,
        {
          "component":<Discover addTask = {addTask} Apps={Apps}/>,
          "type":"Shell",
          "id":taskList.length,
          "layer":0,
          "name":"Discover"
        }
      ])
    }, 200)
    const container = document.getElementById("container");
    cursor = document.getElementById("cursor");

    // 컨테이너의 위치 및 크기
    const bounds = container.getBoundingClientRect();

    console.log(bounds);

    document.addEventListener("mousemove", (event) => {
        let x = event.clientX - bounds.x;
        let y = event.clientY - bounds.y;
        setMouseBeacon([event.clientX, event.clientY]);
        // 컨테이너 내부에만 커서를 제한
        x = Math.max(0, Math.min(bounds.width - 5, x));
        y = Math.max(0, Math.min(bounds.height - 5, y));

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        
        setCursorLeft(`${x}`);
        setCursorTop(`${y}`);
    });
  },[])

  

  return(
    <div>
      <Suspense fallback={null}>
        <div className="king">
          <main style={displayDriver}>
            <div id="container">
              <div id="cursor"></div>
              {
                taskList.map((task) => {
                  return (
                    <Application key={task.name}
                                 name={task.name}
                                 uid={task.id}
                                 type={task.type}
                                 appSetup={task.appSetup}
                                 layer={layer}
                                 focus={focus}
                                 taskList={taskList}
                                 cursorLeft={cursorLeft}
                                 cursorTop={cursorTop}
                                 setLayer={setLayer}
                                 setTaskList={setTaskList}
                                 setFocus={setFocus}
                                 removeTask={removeTask}
                                 removeCompnent={task}
                                 mouseBeacon={mouseBeacon}
                    >{task.component}</Application>
                  )
                })
              }
              {startOption? <Observer addTask={addTask}/>:<></>}
              <footer style={taskBarStyle}>
                <ul style={taskListStyle}>
                  {
                    taskList.map((task) => {
                      if(task.type==="Shell") {
                        return(
                          <li style={taskStyle} key={task.name}>
                            <button style={startOption?taskSelectButtonStyle:taskButtonStyle} onClick={()=>{
                              setStartOption(!startOption);
                              if(startOption===true){
                                setFocus(backUpFocus);
                              }else {
                                setBackUpFocus(focus);
                                setFocus(task.name);
                              }}}>Start</button>
                          </li>
                        )
                      } else {
                        if (task.name === focus) {
                          return (
                            <li style={taskStyle} key={task.name}>
                            <button style={taskSelectButtonStyle} onClick={() => {
                              }}>{task.name}</button>
                            </li>
                          )
                        } else {
                          return (
                            <li style={taskStyle} key={task.name}>
                              <button style={taskButtonStyle} onClick={() => {
                                setFocus(task.name);
                              }}>{task.name}</button>
                            </li>
                          )
                        }
                      }
                    })
                  }
                </ul>
              </footer>
            </div>
          </main>
        </div>
      </Suspense>
    </div>
  )
}
export default WindowManager;