
import { useEffect, useState } from "react";
import Geometry from "./analysis/Geometry";
import { useRecoilState,  } from "recoil";
import { AnalysisLayer, analysisLayersState, hasFeatureInfoState } from "@/recoils/Analysis";
import axios from "axios";
import { produce } from "immer";
import convert from "xml-js";
import Space from "./analysis/Space";
import Support from "./analysis/Support";
import AdditionalSpace from "./analysis/AdditionalSpace";
import ListViewButton from "./analysis/ListViewButton";

/**
 * 분석
 * @returns
 */
export enum AnalysisMenu {
  GEOMETRY,
  SPACE,
  SUPPORT,
  ADDITIONAL_SPACE
}

const menus = [
  { label: '지형', type: AnalysisMenu.GEOMETRY},
  { label: '전술공간', type: AnalysisMenu.SPACE },
  { label: '전투지원', type: AnalysisMenu.SUPPORT},
  { label: '추가공간', type: AnalysisMenu.ADDITIONAL_SPACE},
]

export const AsideAnalysis = () => {
  const [hasFeatureInfo, setHasFeatureInfo] = useRecoilState<boolean>(hasFeatureInfoState);
  const [analysisLayers, setAnalysisLayers] = useRecoilState<AnalysisLayer[]>(analysisLayersState);
  const [menu, setMenu] = useState<AnalysisMenu>(AnalysisMenu.GEOMETRY);
  useEffect(() => {
    if (hasFeatureInfo) return;
    axios.get(`${import.meta.env.VITE_ANAL_GEOSERVER_URL}/ows?service=WCS&version=2.0.1&request=GetCapabilities`)
    .then((res) => {
        const {data} = res;
        
        const capJson = JSON.parse(convert.xml2json(data, {compact: true, }));
        if (!capJson) return;

        const {'wcs:Capabilities': Capability} = capJson;
        const {'wcs:Contents':Layer} = Capability;
        const {'wcs:CoverageSummary': layers} = Layer;
        const analysisLayerNames = analysisLayers.map((item) => item.name);

        setAnalysisLayers(produce((draft) => {
            draft.length = 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            draft.push(...layers.filter((item:any) => {
                const titleObj = item['ows:Title'];
                const title = titleObj._text;
                
                return analysisLayerNames.includes(title);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).map((item:any) => {
                const titleObj = item['ows:Title'];
                const title = titleObj._text;

                const bboxObj = item['ows:WGS84BoundingBox'];
                const lowerCornerObj = bboxObj['ows:LowerCorner'];
                const lowerCorner = lowerCornerObj._text;
                const upperCornerObj = bboxObj['ows:UpperCorner'];
                const upperCorner = upperCornerObj._text;
                
                return {
                    name: title,
                    lowerCorner,
                    upperCorner
                }
            }))
        }));
        setHasFeatureInfo(true);
    }).catch(console.error)
  }, []);
  
  return (
    <aside className="gray-bg">
      {/* <div className="aside-search width-88 marginTop-20">
        <form id="" method="post" action="">
          <input type="text" className="aside-searh-type boxShadow-basic" placeholder="검색어를 입력하세요." />
        </form>
      </div> */}
      <div className="aside-content marginTop-20">
        <ListViewButton />
        <ul className="tabMenu width-88">
          {menus.map((item, index) => (
            <li 
              key={index} 
              className={menu === item.type ? 'on' : ''} 
              onClick={() => setMenu(item.type)}
              style={{cursor: 'pointer'}}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className="height-98 yScroll">
          <p style={{margin: '0px', color: 'red', fontSize: '12px'}}>입력 자료와 파라미터에 따라 처리 시간이 길어질 수 있습니다.</p>
          {
              menu === AnalysisMenu.GEOMETRY && <Geometry />
          }
          {
              menu === AnalysisMenu.SPACE && <Space />
          }
          {
              menu === AnalysisMenu.SUPPORT && <Support />
          }
          {
              menu === AnalysisMenu.ADDITIONAL_SPACE && <AdditionalSpace />
          }
        </div>
      </div>
    </aside>
  );
};
