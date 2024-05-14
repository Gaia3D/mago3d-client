import { useState } from "react";
import FieldManeuver from "./space/FieldManeuver";
import OptimalStation from "./space/OptimalStation";
import EnemyObservation from "./space/EnemyObservation";
import Penetration from "./space/Penetration";

enum Menu {
  FieldManeuver,
  Penetration,
  OptimalStation,
  EnemyObservation,
}
const Space = () => {
  const [collapseMenu, setCollapseMenu] = useState<Menu | null>(null);
  const toggle = (menu: Menu) => {
    if (collapseMenu === menu) {
      setCollapseMenu(null);
    } else {
      setCollapseMenu(menu);
    }
  }
  return (
    <>
      <div 
        className={`${collapseMenu === Menu.FieldManeuver ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-30`}
        onClick={()=>{toggle(Menu.FieldManeuver)}}
      >
        야지기동 분석
      </div>
      {
        collapseMenu === Menu.FieldManeuver &&
        <FieldManeuver />
      }
      <div 
        className={`${collapseMenu === Menu.Penetration ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
        onClick={()=>{toggle(Menu.Penetration)}}
      >
        공중침투 분석
      </div>
      {
        collapseMenu === Menu.Penetration &&
        <Penetration />
      }
      <div 
        className={`${collapseMenu === Menu.OptimalStation ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
        onClick={()=>{toggle(Menu.OptimalStation)}}
      >
        주둔최적지 분석
      </div>
      {
        collapseMenu === Menu.OptimalStation &&
        <OptimalStation />
      }
      <div 
        className={`${collapseMenu === Menu.EnemyObservation ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
        onClick={()=>{toggle(Menu.EnemyObservation)}}
      >
        적종팀 은거 및 관측 분석
      </div>
      {
        collapseMenu === Menu.EnemyObservation &&
        <EnemyObservation />
      }
    </>
  )
}

export default Space;