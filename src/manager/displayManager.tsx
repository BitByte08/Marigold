import styled from "styled-components";
import {PropsWithChildren} from "react";
import {create} from "zustand/react";

const DisplayContainer = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: 1fr ${props => props.width || 80}% 1fr;
    grid-template-rows: 1fr ${props => props.height || 80}% 1fr;
    grid-template-areas:"top top top"
    "left Display right"
    "bot bot bot"
`;
const Container = styled.div`
    z-index: 999999;
    background-color: black;
`
const TopContainer = styled(Container)`
    grid-area: top;
`
const BottomContainer = styled(Container)`
    grid-area: bot;
`
const LeftContainer = styled(Container)`
    grid-area: left;
`
const RightContainer = styled(Container)`
    grid-area: right;
`

interface DisplayManagerStateInterface {
  height: number
  width: number
}

interface DisplayManagerActionInterface {
  actions:{
    setSize: (height:number,width:number) => void
  }
}

const useDisplayManagerState =
  create<DisplayManagerStateInterface & DisplayManagerActionInterface>((set, get)=>(
    {
      height: 80,
      width: 80,
      actions:{
        setSize: (height:number,width:number) => {
          set({height:height, width:width});
        }
      }
    }
  ))
const DisplayManager = (props:PropsWithChildren) => {
  const height = useDisplayManagerState(state => state.height);
  const width = useDisplayManagerState(state => state.width);
  return (
    <DisplayContainer height ={height} width ={width} >
      <TopContainer />
      <LeftContainer />
      {props.children}
      <RightContainer />
      <BottomContainer />
    </DisplayContainer>
  )
}

export {DisplayManager, useDisplayManagerState};