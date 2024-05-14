import { PointLayerInfo } from "../AdditionalSpace";
import axios from "axios";
import * as Cesium from "cesium";
import { produce } from "immer";
import { SubmitHandler, set, useForm } from "react-hook-form";
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
    const { inputFeatures, closeLine, geodesicLine, lineField, sortField, useBezierCurve, bboxLowerCorner, bboxUpperCorner } = payload;
    
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>statistics:PointsToLine</ows:Identifier>
	<wps:DataInputs>
		<wps:Input>
			<ows:Identifier>inputFeatures</ows:Identifier>
			<wps:Reference xlink:href="http://geoserver/wfs" method="POST" mimeType="application/xml">
				<wps:Body>
					<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2">
                        <wfs:Query typeName="${inputFeatures}">
                            <ogc:Filter>
                                <ogc:BBOX>
                                    <ogc:PropertyName/>
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
			<ows:Identifier>lineField</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${lineField}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>sortField</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${sortField}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>useBezierCurve</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${useBezierCurve}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>closeLine</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${closeLine}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>geodesicLine</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${geodesicLine}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
	</wps:DataInputs>
	<wps:ResponseForm>
		<wps:RawDataOutput mimeType="application/json">
			<ows:Identifier>result</ows:Identifier>
		</wps:RawDataOutput>
	</wps:ResponseForm>
</wps:Execute>`;
}
type Payload = {
  inputFeatures: string;
  lineField: string
  sortField: string;
  useBezierCurve: number;
  closeLine: string;
  geodesicLine: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
}

type LayerAndFields = {
  name: string;
  fields: (string)[];
}
const PointsToLine = ({pointLayerInfo}:{pointLayerInfo:PointLayerInfo}) => {
  const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
  const { setResultEntityIds, globeController, getConner, clearResultEntityIds} = useAnalSpace('statistics:FrozenArea');
  const [layerNFields, setLayerNFields] = useState<LayerAndFields[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<(string)[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSortField, setSelectedSortField] = useState<string>('');
  const {analysisFeatureCollection} = useAnalResult();


  useEffect(() => {
    const layerNFields = pointLayerInfo.reduce((acc, item)=>{
      const layerName = Object.keys(item)[0];
      const properties = item[layerName];
      const fields = properties/* .filter((property) => property.valueType !== 'string') */.map((property)=>{
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
    setSelectedSortField(layerNFields[0].fields[0]);
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

  const sortFieldChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortField(e.target.value);
  }
  
  const onSubmit: SubmitHandler<Payload> = async (data) => {
    clearResultEntityIds();
    const {bboxLowerCorner, bboxUpperCorner} = getConner();
    data.inputFeatures = selectedLayer;
    data.sortField = selectedSortField;
    data.lineField = selectedField;
    data.bboxLowerCorner = bboxLowerCorner;
    data.bboxUpperCorner = bboxUpperCorner;
    
    analysisFeatureCollection({
      xml: requestXML(data),
      result: {
        layerName: '포인트를 라인으로 변환',
        changable: true,
        step: ResultLayerStepType.SIMPLIFY,
        type: ResultLayerDataType.Entity,
        lineColor: '#19AFED',
        lineOpacity: 1,
        lineWidth: 2,
        isCustom: false
      }
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="inputFeatures">포인트 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="PointsToLine" propName="inputFeatures"/>
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
        <label htmlFor="lineField">라인 그룹 필드 <AnalHelp analName="PointsToLine" propName="lineField"/></label>
        <select 
          id="lineField" 
          {...register("lineField")} 
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
        <label htmlFor="sortField">정렬 필드 <AnalHelp analName="PointsToLine" propName="sortField"/></label>
        <select 
          id="sortField" 
          {...register("sortField")} 
          value={selectedSortField}
          onChange={sortFieldChange}
        >
        {
          selectedFields.map((field, idx) => {
            return (
              <option value={field} key={idx}>{field}</option>
            )
          })
        }
        </select>
        <label htmlFor="useBezierCurve">베이지어 커브 사용 <AnalHelp analName="PointsToLine" propName="useBezierCurve"/></label>
        <select 
          id="useBezierCurve" 
          {...register("useBezierCurve")} 
          defaultValue={'false'}
        >
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <label htmlFor="closeLine">라인 폐합 <AnalHelp analName="PointsToLine" propName="closeLine"/></label>
        <select 
          id="closeLine" 
          {...register("closeLine")} 
          defaultValue={'false'}
        >
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <label htmlFor="geodesicLine">측지선 사용 <AnalHelp analName="PointsToLine" propName="geodesicLine"/></label>
        <select 
          id="geodesicLine" 
          {...register("geodesicLine")} 
          defaultValue={'false'}
        >
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <div className="btn clearBoth marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}

export default PointsToLine;