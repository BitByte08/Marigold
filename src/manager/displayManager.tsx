import styled from "styled-components";
import {PropsWithChildren} from "react";

const DisplayContainer = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: 1fr 80% 1fr;
    grid-template-rows: 1fr 80% 1fr;
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
const DisplayManager = (props:PropsWithChildren) => {
  return (
    <DisplayContainer>
      <TopContainer />
      <LeftContainer />
      {props.children}
      <RightContainer />
      <BottomContainer />
    </DisplayContainer>
  )
}

export default DisplayManager