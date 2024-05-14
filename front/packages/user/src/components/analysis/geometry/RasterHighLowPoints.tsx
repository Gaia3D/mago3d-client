import { ResultLayerDataType, ResultLayerStepType, } from "@/recoils/Analysis";
import * as Cesium from "cesium";
import { SubmitHandler, useForm } from "react-hook-form";
import { DrawType, useAnalGeometryDraw } from "@/hooks/useAnalGeometryDraw";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

const requestRasterHighLowPoints = (payload:RasterHighLowPointsPayload) => {
    const { inputCoverage, bandIndex, cropShape, valueType } = payload;
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>statistics:RasterHighLowPoints</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier>inputCoverage</ows:Identifier>
        <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
          <wps:Body>
            <wcs:GetCoverage service="WCS" version="1.1.1">
              <ows:Identifier>mdtp:${inputCoverage}</ows:Identifier>
              <wcs:DomainSubset />
              <wcs:Output format="image/tiff"/>
            </wcs:GetCoverage>
          </wps:Body>
        </wps:Reference>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>cropShape</ows:Identifier>
        <wps:Data>
            <wps:ComplexData mimeType="application/wkt"><![CDATA[${cropShape}]]></wps:ComplexData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>bandIndex</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${bandIndex}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>valueType</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${valueType}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier>result</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`
}

type RasterHighLowPointsPayload = {
    inputCoverage: string;
    lowerCorner: string;
    upperCorner: string;
    bandIndex: number;
    cropShape: string;
    valueType: 'Both' | 'High' | 'Low';
}

const RasterHighLowPoints = () => {
  const LIKE_RASTER_LAYER = ['경사도래스터', '사면향래스터', '속도래스터', '음영기복래스터', '표고래스터', '표고래스터30M'];
  const { register, handleSubmit, formState: { errors}} = useForm<RasterHighLowPointsPayload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType} = useAnalGeometryDraw({});
  const {analysisFeatureCollection} = useAnalResult();

  const onSubmit: SubmitHandler<RasterHighLowPointsPayload> = (data) => {
      if (cropShape === null) {
          alert('영역을 그려주주세요.');
          return;
      }

      data.cropShape = cropShape;
      
      analysisFeatureCollection({
        xml: requestRasterHighLowPoints(data),
        result: {
          layerName: '최고 최저점 찾기',
          changable: false,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          isCustom: true,
          customFunction: (data, dataSource) => {
            const {features} = data;
            if (!features) throw Error('no features');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const entities = features.map((item:any) => {
                const {geometry, properties} = item;
                const {val, cat} = properties;
                const {coordinates} = geometry;

                const [lng, lat] = coordinates;
                const cartesian = Cesium.Cartesian3.fromDegrees(lng, lat)
                dataSource.entities.add({
                    position: cartesian,
                    point: {
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        color: cat === 'H' ? Cesium.Color.BLUEVIOLET : Cesium.Color.RED,
                        pixelSize: 10,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    },
                    label: {
                        text: `${cat === 'H' ? '최고' : '최저'} : ${val.toFixed(2)}`,
                        showBackground: true,
                        font: '16px sans-serif',
                        backgroundColor: cat === 'H' ? Cesium.Color.BLUEVIOLET.withAlpha(0.7) : Cesium.Color.RED.withAlpha(0.7),
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                });
            });

            return entities.length;
          }
        }
      });
  }
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
          <label htmlFor="inputCoverage">입력 래스터 레이어 
            <span className="bullet-essential">*</span>
            <AnalHelp analName="RasterHighLowPoints" propName="inputCoverage"/>
          </label>
          <select 
              id="inputCoverage" 
              {...register("inputCoverage")}
              defaultValue="표고래스터"
          >
              {
                    LIKE_RASTER_LAYER.map((name, idx) => {
                      return (
                        <option value={name} key={idx}>{name}</option>
                      )
                    })
                }
          </select>
          <label>밴드 인덱스 <AnalHelp analName="RasterHighLowPoints" propName="bandIndex"/></label>
          <input 
              type="number" id="bandIndex" 
              {...register("bandIndex")}
              value="0"
          />
          <label style={{fontSize:'10px'}}>잘라낼 지오메트리 영역 <AnalHelp analName="RasterHighLowPoints" propName="cropShape"/></label>
          <div className="btn-div">
              <button className={`drawBtn circle-icon ${drawType === DrawType.Circle ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Circle)}}></button>
              <button className={`drawBtn box-icon ${drawType === DrawType.Box ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Box)}}></button>
              <button className={`drawBtn polygon-icon ${drawType === DrawType.Polygon ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Polygon)}}></button>
          </div>
          {
              cropShape ? (
                  <>
                      <label>잘라낼 도형</label>
                      <div className="btn-div">
                          <div className="coordinate-txt">{cropShape}</div>
                          <button className="btn-coordinate-delete" type="button" onClick={clearCropShape}>x</button>
                      </div>
                  </>
              ) : null
          }
          <label>값 유형 <AnalHelp analName="RasterHighLowPoints" propName="valueType"/></label>
          <select id="valueType"{...register("valueType")} defaultValue={'High'}>
              <option value="Both">최고/최저 모두</option>
              <option value="High">최고점만</option>
              <option value="Low">최저점만</option>
          </select>
          <div className="btn clearBoth marginTop-5">
              <button type="submit" className="btn-apply">분석</button>
          </div>
      </div>
      </form>
  )
}   

export default RasterHighLowPoints;