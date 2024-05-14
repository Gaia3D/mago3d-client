import { PointLayerInfo } from "../AdditionalSpace";
import axios from "axios";
import * as Cesium from "cesium";
import { produce } from "immer";
import { SubmitHandler, useForm } from "react-hook-form";
import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { useAnalSpace } from "@/hooks/useAnalSpace";
import { useEffect, useState } from "react";
import { parseFromWK } from 'wkt-parser-helper';
import {bbox as turfBbox} from '@turf/turf';
import { arrayBufferToBase64 } from "@/api/util";
import { useAnalResult } from "@/hooks/useAnalResult";
import { ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import AnalHelp from "../AnalInfo";

const requestXML = (payload:Payload) => {
    const { inputFeatures, maskArea, populationField, bboxLowerCorner, bboxUpperCorner, width, height } = payload;
    
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>statistics:RasterToImage</ows:Identifier>
	<wps:DataInputs>
		<wps:Input>
			<ows:Identifier>coverage</ows:Identifier>
			<wps:Reference xlink:href="http://geoserver/wps" method="POST" mimeType="image/tiff">
				<wps:Body>
					<wps:Execute service="WPS" version="1.0.0">
						<ows:Identifier>statistics:KernelDensity</ows:Identifier>
						<wps:DataInputs>
							<wps:Input>
								<ows:Identifier>inputFeatures</ows:Identifier>
								<wps:Reference xlink:href="http://geoserver/wfs" method="POST" mimeType="application/xml">
									<wps:Body>
										<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2">
											<wfs:Query typeName="${inputFeatures}">
												<ogc:Filter>
													<ogc:BBOX>
														<ogc:PropertyName>geom</ogc:PropertyName>
														<gml:Envelope srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                                                            <gml:lowerCorner>${bboxLowerCorner}</gml:lowerCorner>
                                                            <gml:upperCorner>${bboxUpperCorner}</gml:upperCorner>
                                                        </gml:Envelope>
													</ogc:BBOX>
												</ogc:Filter>
											</wfs:Query>
										</wfs:GetFeature>
									</wps:Body>
								</wps:Reference>
							</wps:Input>
							<wps:Input>
								<ows:Identifier>kernelType</ows:Identifier>
								<wps:Data>
									<wps:LiteralData>Quadratic</wps:LiteralData>
								</wps:Data>
							</wps:Input>
							<wps:Input>
								<ows:Identifier>populationField</ows:Identifier>
								<wps:Data>
									<wps:LiteralData>${populationField}</wps:LiteralData>
								</wps:Data>
							</wps:Input>
							<wps:Input>
								<ows:Identifier>searchRadius</ows:Identifier>
								<wps:Data>
									<wps:LiteralData>0</wps:LiteralData>
								</wps:Data>
							</wps:Input>
							<wps:Input>
								<ows:Identifier>cellSize</ows:Identifier>
								<wps:Data>
									<wps:LiteralData>0</wps:LiteralData>
								</wps:Data>
							</wps:Input>
							<wps:Input>
								<ows:Identifier>extent</ows:Identifier>
								<wps:Data>
									<wps:BoundingBoxData crs="EPSG:4326">
										<ows:LowerCorner>${maskArea[0]} ${maskArea[1]}</ows:LowerCorner>
										<ows:UpperCorner>${maskArea[2]} ${maskArea[3]}</ows:UpperCorner>
									</wps:BoundingBoxData>
								</wps:Data>
							</wps:Input>
						</wps:DataInputs>
						<wps:ResponseForm>
							<wps:RawDataOutput mimeType="image/tiff">
								<ows:Identifier>result</ows:Identifier>
							</wps:RawDataOutput>
						</wps:ResponseForm>
					</wps:Execute>
				</wps:Body>
			</wps:Reference>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>bbox</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${maskArea[0]},${maskArea[1]},${maskArea[2]},${maskArea[3]}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>crs</ows:Identifier>
			<wps:Data>
				<wps:LiteralData></wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>width</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${width}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>height</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${height}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>format</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>image/png</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>transparent</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>true</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>bgColor</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>0xFFFFFF</wps:LiteralData>
			</wps:Data>
		</wps:Input>
	</wps:DataInputs>
	<wps:ResponseForm>
		<wps:RawDataOutput mimeType="image/png">
			<ows:Identifier>result</ows:Identifier>
		</wps:RawDataOutput>
	</wps:ResponseForm>
</wps:Execute>`;
}

type Payload = {
  inputFeatures: string;
  populationField: string;
  maskArea: number[];
  bboxLowerCorner: string;
  bboxUpperCorner: string;
  width: number;
  height: number;
}

type LayerAndFields = {
  name: string;
  fields: (string)[];
}
const KernelDensity = ({pointLayerInfo}:{pointLayerInfo:PointLayerInfo}) => {
  const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
  const {clearCropShape, cropShape, globeController, drawType, toggleDrawType, getConner} = useAnalSpace('statistics:FrozenArea');
  const [layerNFields, setLayerNFields] = useState<LayerAndFields[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<(string)[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');

  const {analysisBlobImage} = useAnalResult();

  useEffect(() => {
    const layerNFields = pointLayerInfo.reduce((acc, item)=>{
      const layerName = Object.keys(item)[0];
      const properties = item[layerName];
      const fields = properties.filter((property) => property.valueType !== 'string').map((property)=>{
        const {fieldName} = property;
        return fieldName;
      });
      if (fields.length > 0) {
        acc.push({  name:layerName, fields })
      }
      return acc;
    } , [] as LayerAndFields[]);
    setLayerNFields(layerNFields);

    if (layerNFields.length === 0) return;

    setSelectedLayer(layerNFields[0].name);
    setSelectedFields(layerNFields[0].fields);
    setSelectedField(layerNFields[0].fields[0]);
  }, [pointLayerInfo])
  

  const layerChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLayer(e.target.value);
    const fields = layerNFields.find(({name})=>name === e.target.value)?.fields;
    setSelectedFields(produce((draft)=>{
      draft.length = 0;
      if (fields) draft.push(...fields);   
    }));
  }

  const fieldChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value);
  }
  
  const onSubmit: SubmitHandler<Payload> = async (data) => {
    const viewer = globeController.viewer;
    if (!viewer) return;
    if (cropShape === null) {
        alert('영역을 그려주세요.');
        return;
    }

    const {bboxLowerCorner, bboxUpperCorner} = getConner();
    data.inputFeatures = selectedLayer;
    data.populationField = selectedField;
    data.bboxLowerCorner = bboxLowerCorner;
    data.bboxUpperCorner = bboxUpperCorner;

    const polygon = parseFromWK(cropShape);
    data.maskArea = turfBbox(polygon);

    const [minx, miny, maxx, maxy] = data.maskArea;
    const topRightCartesian = Cesium.Cartesian3.fromDegrees(maxx, maxy);
    const bottomLeftCartesian = Cesium.Cartesian3.fromDegrees(minx, miny);

    const topRightPixel = viewer.scene.cartesianToCanvasCoordinates(topRightCartesian);
    const bottomLeftPixel = viewer.scene.cartesianToCanvasCoordinates(bottomLeftCartesian);
    
    data.width = topRightPixel.x - bottomLeftPixel.x;
    data.height = bottomLeftPixel.y - topRightPixel.y;

    if (polygon.type !== 'Polygon') return;
    const cartesians = polygon.coordinates[0].map(([lon, lat])=>Cesium.Cartesian3.fromDegrees(lon, lat));

    analysisBlobImage({
      xml : requestXML(data),
      result: {
        layerName: '커널 밀도분석',
        changable: false,
        isCustom: false,
        type: ResultLayerDataType.Entity,
      },
      hierarchy: cartesians,
      type: 'image/png'
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="inputFeatures">포인트 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="KernelDensity" propName="inputFeatures"/>
        </label>
        <select 
          id="inputFeatures" 
          {...register("inputFeatures")} 
          value={selectedLayer}
          onChange={layerChange}
        >
        {
          layerNFields.map(({name}, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="populationField">모집단 필드 <AnalHelp analName="KernelDensity" propName="populationField"/></label>
        <select 
          id="populationField" 
          {...register("populationField")} 
          value={selectedField}
          onChange={fieldChange}
        >
        {
          selectedFields.map((field, idx) => {
            return (
              <option value={field} key={idx}>{field}</option>
            )
          })
        }
        </select>
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="KernelDensity" propName="cropShape"/></label>
        <div className="btn-div">
          <button className={`drawBtn box-icon ${drawType === DrawType.Box ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Box)}}></button>
        </div>
        {
          cropShape ? (
            <>
            <label>잘라낼 도형</label>
            <div className="btn-div">
                <div className="coordinate-txt">{cropShape}</div>
                <button className="btn-coordinate-delete" type="button" onClick={clearCropShape}>X</button>
            </div>
            </>
          ) : null
        }
        <div className="btn marginTop-5 clearBoth">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}

export default KernelDensity;