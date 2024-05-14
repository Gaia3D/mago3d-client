import { useEffect, useState } from "react";
import BufferFeatures from "./add/BufferFeatures";
import ExtractValuesToPoints from "./add/ExtractValuesToPoints";
import KernelDensity from "./add/KernelDensity";
import MultipleRingBuffer from "./add/MultipleRingBuffer";
import PointStacker from "./add/PointStacker";
import PointsToLine from "./add/PointsToLine";
import axios from "axios";

enum Menu {
    KernelDensity,
    PointStacker,
    ExtractValuesToPoints,
    BufferFeatures,
    MultipleRingBuffer,
    PointsToLine
}
export const LIKE_POINT_LAYER_NAMES = ['송전탑','수송도도로노드','수송도철도교차점','수송도회전정보'];
export type PointLayerFeatureValueType = {
    fieldName: string;
    valueType: any;
}
export type PointLayerInfo = Record<string, PointLayerFeatureValueType[]>[];
const AdditionalSpace = () => {
    const [collapseMenu, setCollapseMenu] = useState<Menu | null>(null);
    const [pointLayerInfo, setPointLayerInfo] = useState<PointLayerInfo>([]);
    
    useEffect(() => {
        if (pointLayerInfo.length > 0) return;
        const promises = LIKE_POINT_LAYER_NAMES.map((layerName) => {
            const params = {
                service: 'WFS',
                version: '1.1.0',
                request: 'DescribeFeatureType',
                outputFormat: 'application/json',
                typeName: layerName,
            };
            return axios({
                method: 'GET',
                url: `${import.meta.env.VITE_ANAL_GEOSERVER_URL}/ows`,
                params,
            });
        });
        const layerInfo:PointLayerInfo = [];
        axios.all(promises).then(axios.spread((...responses) => {
            responses.forEach((response) => {
                const {data:{featureTypes:featureTypes}} = response;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const {typeName, properties}:{typeName:string, properties:any} = featureTypes[0];
                
                const featureValueType:PointLayerFeatureValueType[] = properties.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filter((property:any)=>property.name !== 'geom')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((property:any) => {
                        const {name, type} = property;
                        return {
                            fieldName: name,
                            valueType: type.split(':')[1],
                        }
                    });
                layerInfo.push({
                    [typeName]: featureValueType
                });
            });
        })).then(() => {
            setPointLayerInfo(layerInfo);
        });
    }, []);

    const toggle = (menu: Menu) => {
        if (collapseMenu === menu) {
            setCollapseMenu(null);
        } else {
            setCollapseMenu(menu);
        }
    }
    
    return (
        <>
            <div className={`${collapseMenu === Menu.KernelDensity ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-30`}
                onClick={()=>{toggle(Menu.KernelDensity)}}>커널 밀도분석</div>
            {
                collapseMenu === Menu.KernelDensity && pointLayerInfo.length > 0 &&
                <KernelDensity pointLayerInfo={pointLayerInfo}/>
            }
            <div className={`${collapseMenu === Menu.PointStacker ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
                onClick={()=>{toggle(Menu.PointStacker)}}>포인트 클러스터</div>
            {
                collapseMenu === Menu.PointStacker &&
                <PointStacker />
            }
            <div className={`${collapseMenu === Menu.ExtractValuesToPoints ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
                onClick={()=>{toggle(Menu.ExtractValuesToPoints)}}>포인트에 래스터 셀값 계산</div>
            {
                collapseMenu === Menu.ExtractValuesToPoints &&
                <ExtractValuesToPoints />
            }
            <div className={`${collapseMenu === Menu.BufferFeatures ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
                onClick={()=>{toggle(Menu.BufferFeatures)}}>버퍼</div>
            {
                collapseMenu === Menu.BufferFeatures &&
                <BufferFeatures />
            }
            <div className={`${collapseMenu === Menu.MultipleRingBuffer ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
                onClick={()=>{toggle(Menu.MultipleRingBuffer)}}>다중 링 버퍼</div>
            {
                collapseMenu === Menu.MultipleRingBuffer &&
                <MultipleRingBuffer />
            }
            <div className={`${collapseMenu === Menu.PointsToLine ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
                onClick={()=>{toggle(Menu.PointsToLine)}}>포인트를 라인으로 변환</div>
            {
                collapseMenu === Menu.PointsToLine && pointLayerInfo.length > 0 &&
                <PointsToLine pointLayerInfo={pointLayerInfo} />
            }
        </>
    )
}

export default AdditionalSpace;