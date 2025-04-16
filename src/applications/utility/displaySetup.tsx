import {useDisplayManagerState} from "@/manager/displayManager.tsx";
import {useState} from "react";
import {toNumber} from "@/modules/typeModule.tsx";


const DisplaySetup = () => {
  const setSize = useDisplayManagerState(state => state.actions.setSize);
  const [height, setHeight] =
    useState(useDisplayManagerState(state => state.height))
  const [width, setWidth] =
    useState(useDisplayManagerState(state => state.width));
  return(
    <>
      <input type="text" onChange={(e)=>setWidth(toNumber(e.target.value))}></input>
      <input type="text" onChange={(e)=>setHeight(toNumber(e.target.value))}></input>
      <button onClick={()=> {
        setSize(height, width);
      }}>적용</button>
    </>
  )
}

export default DisplaySetup;