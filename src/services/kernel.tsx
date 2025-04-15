import WindowManager from '../manager/windowManager.tsx';
import {DisplayDriver} from "@/drivers/displayDriver.tsx";

function Kernel() {
  //작업 관리를 위한 메니저 호출
  return (
    <DisplayDriver className="kernel">
      <WindowManager />
    </DisplayDriver>
  )
}

export default Kernel
