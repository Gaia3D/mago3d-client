import { useState } from "react";
import RadialLineOfSight from "./geometry/RadialLineOfSight";
import LinearLineOfSight from "./geometry/LinearLineOfSight";
import RasterProfile from "./geometry/RasterProfile";
import RasterHighLowPoints from "./geometry/RasterHighLowPoints";
import PathAnalysis from "./geometry/PathAnalysis";
import RangeDome from "./geometry/RangeDome";

enum Menu {
  RadialLineOfSight,
  LinearLineOfSight,
  RasterProfile,
  RasterHighLowPoints,
  PathAnalysis,
  RangeDome
}
const Geometry = () => {
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
            className={`${collapseMenu === Menu.RadialLineOfSight ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-30`}
            onClick={()=>{toggle(Menu.RadialLineOfSight)}}
          >
            방사형 가시선 분석
          </div>
        {
          collapseMenu === Menu.RadialLineOfSight &&
          <RadialLineOfSight />
        }
          <div 
            className={`${collapseMenu === Menu.LinearLineOfSight ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.LinearLineOfSight)}}
          >
            선형 가시선 분석
          </div>
        {
          collapseMenu === Menu.LinearLineOfSight &&
          <LinearLineOfSight />
        }
          <div 
            className={`${collapseMenu === Menu.RasterProfile ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.RasterProfile)}}
          >
            래스터 단면도 분석
          </div>
        {
          collapseMenu === Menu.RasterProfile &&
          <RasterProfile />
        }
          <div 
            className={`${collapseMenu === Menu.RasterHighLowPoints ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.RasterHighLowPoints)}}
          >
            최고 최저점 찾기
          </div>
        {
          collapseMenu === Menu.RasterHighLowPoints &&
          <RasterHighLowPoints />
        }
          <div 
            className={`${collapseMenu === Menu.PathAnalysis ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.PathAnalysis)}}
          >
            경로분석
          </div>
        {
          collapseMenu === Menu.PathAnalysis &&
          <PathAnalysis />
        }
          <div 
            className={`${collapseMenu === Menu.RangeDome ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.RangeDome)}}
          >
            화망분석
          </div>
        {
          collapseMenu === Menu.RangeDome &&
          <RangeDome />
        }
        </>
    )
}

export default Geometry;