import { CoordinateType } from "@/api/Coordinate";
import { SearchCoordinateOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { Dd } from "./coord/Dd";
import { Dms } from "./coord/Dms";
import { Dm } from "./coord/Dm";
import { Mgrs } from "./coord/Mgrs";
import { Gars } from "./coord/Gars";
import { Utm } from "./coord/Utm";

const coordinateTypes:Partial<CoordinateType>[] = [
  'DD',
  'DM',
  'DMS',
  'MGRS',
  'UTM',
  'GARS'
]

export const SearchCoordinate = () => {
  const el = document.querySelector("#map");
  const [open, setOpen] = useRecoilState(SearchCoordinateOpenState);
  const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);
  const [selectedCoordinate, setSelectedCoordinate] = useState<CoordinateType>('DMS');
  
  const node = (
    <div className="dialog-cornidate darkMode">
      <div className="dialog-title">
        <h3>좌표검색</h3>
        <button className="close floatRight" onClick={()=>{setOpen(false);setSelectedTool(null)}}></button>						
      </div>
      <div className="dialog-content">
        <ul className="cordinate-search">
          {
            coordinateTypes.map((type, index) => {
              return (
                <li key={index} className={selectedCoordinate === type ? "on" : ""} onClick={()=>setSelectedCoordinate(type)}><a>{type}</a></li>
              )
            })
          }
        </ul>	
        {
          selectedCoordinate === 'DMS' && <Dms/>
        }
        {
          selectedCoordinate === 'DM' && <Dm/>
        }
        {
          selectedCoordinate === 'DD' && <Dd/>
        }
        {
          selectedCoordinate === 'MGRS' && <Mgrs />
        }
        {
          selectedCoordinate === 'GARS' && <Gars />
        }
        {
          selectedCoordinate === 'UTM' && <Utm />
        }
      </div>
    </div>
  )
  return el && open ? ReactDOM.createPortal(node, el) : null;
}