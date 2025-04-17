import {useEffect, useState} from 'react';
import {useDrag} from 'react-use-gesture';
import {toNumber} from "@/modules/typeModule.tsx";
import styled from "styled-components";

const Window = styled.article`
    border: 1px solid #575757;
    border-radius: 5px;
`
const WindowHeader = styled.header`
    background-color: #3A3A3A;
    border-radius: 4px 4px 0 0;
    padding: 0 5px;
    position : absolute;
    display : flex;
    justify-content: space-between;
    align-items: center;
    top : 0;
    left : 0;
    right : 0;
    height : 30px;
`;
const Title = styled.p`
    padding : 0 5px 0 0;
    color: white;
`;
const HeaderButton = styled.button`
    height : 20px;
    width : 20px;
    margin-right: 5px;
`;
const NotFocusButton = styled(HeaderButton)`
    background-color: lightgray;
    border: 1px solid gray;
    border-radius : 2px;
`
const MinimizeButton = styled(HeaderButton)`
    background-color: orange;
    border: 1px solid darkorange;
    border-radius: 2px;
    &:hover {
        background-color: darkorange;
        border: 1px solid darkgoldenrod;
    }
`;
const FullScreenButton = styled(HeaderButton)`
    background-color: greenyellow;
    border: 1px solid green;
    border-radius: 2px;
    &:hover {
        background-color: green;
        border: 1px solid darkgreen;
    }
`;
const ExitButton = styled(HeaderButton)`
    background-color: red;
    border: 1px solid darkred;
    border-radius: 2px;
    &:hover {
        background-color: darkred;
        border: 1px solid #600000;
    }
`;
const WindowContent = styled.div`
    position : absolute;
    top : 30px;
    left : 0;
    right : 0;
    bottom : 0;
    padding : 0 2px 2px 2px;
    box-sizing: border-box;
    background-color: #3A3A3A;
    border-radius: 0 0 4px 4px;
`;
const Shell = styled.article`
    height : 100%;
    width : 100%;
`;


const Application = (props:any) => {
  const windowProps:React.CSSProperties = {
    position : "absolute",
    height : 400,
    width : 300,
    top : (20 * globalThis.innerHeight) / 100,
    left : (30 * globalThis.innerWidth) / 100,
    backgroundColor : "black",
    zIndex: props.layer,
    filter: "dropShadow(gray 0px 0px 15px)",
  }
  const [window, setWindow] = useState<React.CSSProperties>(windowProps);//창 Props
  const [backupWindow, setBackupWindow] = useState<React.CSSProperties>(window);//창 최대화 전 Props 백업
  const [cursor, setCursor] = useState<number[]>(props.cursorVec);//보정 후 커서 위치
  const [beforeSizeParams, setBeforeSizeParams] = useState<number[]>([0.0,0.0]);//이전 useDrag params 저장(size)
  const [beforeMoveParams, setBeforeMoveParams] = useState<number[]>(props.cursorVec);//이전 useDrag params 저장(move)
  const [isFirst, setIsFirst] = useState<boolean>(true);//첫 클릭 여부
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);//창 최대 여부
  const [isMinimized, setIsMinimized] = useState<boolean>(false);//창 최소화 여부

  useEffect(() => { //cursorVec 동기화
    setBeforeMoveParams(cursor);
    setCursor(props.cursorVec);
  }, [props.cursorVec]);
  useEffect(()=>{ //창 Props 수정될 시 Focus
    if(!isMinimized && (props.focus !== props.name)) {
      props.setFocus(props.name);
    }
  },[window])
  useEffect(()=>{
    if(isMinimized){
      setWindow({
        display: "none",
        position: window.position,
        height: window.height,
        width: window.width,
        top: window.top,
        left: window.left,
        zIndex: props.layer,
        backgroundColor: window.backgroundColor,
        filter: "dropShadow(gray 0px 0px 15px)"
      })
      props.setFocus("Discover");
    }
  },[isMinimized])
  useEffect(()=>{
    if(props.tabDownInterrupt==props.name) {
      setIsMinimized(true);
      props.setTabDownInterrupt("empty")
    }
  },[props.tabDownInterrupt])
  useEffect(()=>{ //Focus가 본인이면 가장 높은 Layer로 렌더링
    if(props.type !== "Shell") {
      if (props.focus === props.name) {
        props.setLayer(props.layer + 1);
        setIsMinimized(false);
        setWindow({
          display: undefined,
          position: window.position,
          height: window.height,
          width: window.width,
          top: window.top,
          left: window.left,
          zIndex: props.layer,
          backgroundColor: window.backgroundColor,
          filter: "dropShadow(gray 0px 0px 15px)",
        })
      }
    }
  },[props.focus])
  useEffect(()=>{ //창 최대화 상태
    if(isFullScreen){
      const container = document.getElementById("display") as HTMLElement;
      const bounds = container.getBoundingClientRect();
      setBackupWindow(window);
      setWindow({
        transition: "all 500ms ease-in-out",
        display: undefined,
        position: window.position,
        height: `calc(100vh - 62px)`,
        width: `calc(100vw - 2px)`,
        top: bounds.top,
        left: 0,
        zIndex: props.layer-1,
        backgroundColor: window.backgroundColor,
        filter: undefined
      })
      setTimeout(()=>{
        setWindow({
          display: undefined,
          position: window.position,
          height: `calc(100vh - 62px)`,
          width: `calc(100vw - 2px)`,
          top: bounds.top,
          left: 0,
          zIndex: props.layer-1,
          backgroundColor: window.backgroundColor,
          filter: undefined
        })
      },500)
    }else if(!isFullScreen){
      setWindow({
        transition: "all 500ms ease-in-out",
        display: backupWindow.display,
        position: backupWindow.position,
        height: backupWindow.height,
        width: backupWindow.width,
        top: backupWindow.top,
        left: backupWindow.left,
        zIndex: backupWindow.zIndex,
        backgroundColor: backupWindow.backgroundColor,
        filter: undefined
      })
      setTimeout(()=>{
        setWindow(backupWindow);
      },500)
    }
  }, [isFullScreen]);

  const Corner = () => {
    const container:HTMLElement = document.getElementById("main") as HTMLElement;
    const bounds = container.getBoundingClientRect();
    const x = props.cursorVec[0] - bounds.x;
    const y = props.cursorVec[1] - bounds.y;
    const { left, top, width, height } = window;

    const nearRight = x >= toNumber(left) + toNumber(width) - 10;
    const nearLeft = x <= toNumber(left) + 10;
    const nearBottom = y >= toNumber(top) + toNumber(height) - 10;

    return [nearRight, nearLeft, nearBottom];
  }

  const widthCondition = () => { //창 가로 크기 조건문
    const [nearRight, nearLeft, nearBottom] = Corner();
    return ((nearRight && nearBottom) || (nearLeft && nearBottom) || nearRight || nearLeft);
  }
  const heightCondition = () => { //창 세로 크기 조건문
    const [nearRight, nearLeft, nearBottom] = Corner();
    return ((nearRight && nearBottom) || (nearLeft && nearBottom) || nearBottom)
  }
  const leftCondition = () => { //창 위치 조건문
    const [, nearLeft, nearBottom] = Corner();
    return ((nearLeft && nearBottom) || nearLeft)
  }
  const widthLimit = (params:any) => { //가로 최소 크기 조건문
    const [nearRight, , ] = Corner();
    if (window.width as unknown as number >=props.appSetup.minWidth){
      if (nearRight) {
        return toNumber(window.width) + params.offset[0] - beforeSizeParams[0];
      }else{
        return toNumber(window.width) - params.offset[0] + beforeSizeParams[0];
      }
    }
    return props.appSetup.minWidth;
  }
  const heightLimit = (params:any) => { //세로 최소 크기 조건문
    if (window.height as unknown as number >=props.appSetup.minHeight){
      return window.height + params.offset[1] - beforeSizeParams[1];
    }
    return props.appSetup.minHeight;
  }
  const leftLimit = (params:any) => { //가로 최소 크기 조건문
    if (window.width as unknown as number >=props.appSetup.minWidth){
      return window.left + params.offset[0] - beforeSizeParams[0];
    }
    return window.left;
  }
  const sizeManager = useDrag((params)=>{ //size 조절
    if(isFirst && !isFullScreen && (heightCondition() || widthCondition() || leftCondition())) {
      const container = document.getElementById("main") as HTMLElement;
      const bounds = container.getBoundingClientRect();
      let x = cursor[0];
      let y = cursor[1];
      console.log(y, bounds.height);
      setWindow({
        display: undefined,
        position: window.position,
        height: ((y <= 0 || y >= bounds.height-62) && heightCondition())?(bounds.height - toNumber(window.top) - 66):(heightCondition()?heightLimit(params):window.height),
        width: ((x <= 0 || x >= bounds.width-6) && (widthCondition()&&!leftCondition()))?(bounds.width - toNumber(window.left) - 4):(widthCondition()?widthLimit(params):window.width),
        top: window.top,
        left: (x <= 0 || x >= bounds.width-6) && leftCondition()?2:(leftCondition()?leftLimit(params):window.left),
        zIndex: props.layer - 1,
        backgroundColor: window.backgroundColor,
        filter: "dropShadow(gray 0px 0px 15px)"
      })
    } else{
        setIsFirst(false);
    }
    setBeforeSizeParams(params.offset);
  })
  const moveManager = useDrag((params)=>{ //위치 조절
    props.setFocus(props.name);
    if(!isFullScreen) {
      const container = document.getElementById("main") as HTMLElement;
      const bounds = container.getBoundingClientRect();
      let x = cursor[0]; let y = cursor[1];
      setWindow({
        display: undefined,
        position: window.position,
        height: window.height,
        width: window.width,
        left: window.left as unknown as number + (x - beforeMoveParams[0]),
        top: window.top as unknown as number + (y - beforeMoveParams[1]),
        zIndex: props.layer - 1,
        backgroundColor: window.backgroundColor,
        filter: "dropShadow(gray 0px 0px 15px)",
      })
    }
  })
  if(props.type==="App") {
    return (
      <Window style={window} onMouseDown={()=>{
        props.setFocus(props.name)
      }}>
        <WindowHeader {...moveManager()}>
          <div>
          {props.focus === props.name?
            <>
              <ExitButton onClick={() =>
                props.removeTask(props.name)
              }></ExitButton>
              <FullScreenButton onClick={()=>
                setIsFullScreen(!isFullScreen)
              }></FullScreenButton>
              <MinimizeButton onClick={()=>
                setIsMinimized(!isMinimized)
              }> </MinimizeButton>
            </>:
            <>
              <NotFocusButton onClick={() =>
                props.removeTask(props.name)
              }></NotFocusButton>
              <NotFocusButton onClick={()=>
                setIsFullScreen(!isFullScreen)
              }></NotFocusButton>
              <NotFocusButton onClick={()=>
                setIsMinimized(!isMinimized)
              }> </NotFocusButton>
            </>
          }
          </div>
          <Title>{props.name}</Title>
        </WindowHeader>
        <WindowContent {...sizeManager()} onMouseUp={()=>setIsFirst(true)}>
          {props.children}
        </WindowContent>
      </Window>
    )
  }else if(props.type==="Shell") {
    return (
      <Shell className="shell" onClick={()=>props.setFocus("Discover")}>
        {props.children}
      </Shell>
    )
  }
}
export default Application;