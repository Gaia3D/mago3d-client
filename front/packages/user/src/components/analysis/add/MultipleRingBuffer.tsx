import { useAnalSpace } from "@/hooks/useAnalSpace";
import { LIKE_POINT_LAYER_NAMES } from "../AdditionalSpace";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Cesium from "cesium";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { AnalysisLayer, ResultLayerDataType, ResultLayerStepType, analysisLayersState } from "@/recoils/Analysis";
import axios from "axios";
import { produce } from "immer";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

const requestXML = (payload:Payload) => {
    const { distance, bboxLowerCorner, bboxUpperCorner, distanceUnit, inputFeatures, dissolve, outsideOnly} = payload;
    
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>statistics:MultipleRingBuffer</ows:Identifier>
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
			<ows:Identifier>distances</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${distance}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>distanceUnit</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${distanceUnit}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>outsideOnly</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${outsideOnly}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>dissolve</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${dissolve}</wps:LiteralData>
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
  distance: string | number;
  distanceUnit: string;
  outsideOnly: number;
  dissolve: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
}
const MultipleRingBuffer = () => {const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
  const {getConner, globeController, setResultEntityIds, LIKE_LINE_LAYER, LIKE_POLYGON_LAYER, clearResultEntityIds} = useAnalSpace('statistics:FrozenArea');
  const {analysisFeatureCollection} = useAnalResult();

  const layers = ([] as string[]).concat(LIKE_LINE_LAYER, LIKE_POLYGON_LAYER, LIKE_POINT_LAYER_NAMES);

  const onSubmit: SubmitHandler<Payload> = async (data) => {
      const {viewer} = globeController;
      
      if(!viewer) return;
      clearResultEntityIds();
      const {bboxLowerCorner, bboxUpperCorner} = getConner();
      data.bboxLowerCorner = bboxLowerCorner;
      data.bboxUpperCorner = bboxUpperCorner;

      analysisFeatureCollection({
        xml: requestXML(data),
        result: {
          layerName: '다중 링 버퍼',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#19AFED',
          fillOpacity: 0.7,
          lineColor: '#FFffff',
          lineOpacity: 1,
          lineWidth: 1,
          isCustom: false
        }
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="inputFeatures">입력 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="MultipleRingBuffer" propName="inputFeatures"/>
        </label>
        <select 
          id="inputFeatures" 
          {...register("inputFeatures")} 
        >
        {
          layers.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="distance" style={{fontSize:'11px'}}>쉼표로 구분된 거리값 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="MultipleRingBuffer" propName="distance"/>
        </label>
        <input type="text" id="distance"
          {...register("distance")} 
          defaultValue="10,100"
        />
        <label htmlFor="distanceUnit">거리 단위 <AnalHelp analName="MultipleRingBuffer" propName="distanceUnit"/></label>
        <select 
          id="distanceUnit" 
          {...register("distanceUnit")} 
          defaultValue={'Meters'}
        >
          <option value="Meters">Meters</option>
          <option value="Kilometers">Kilometers</option>
          <option value="Inches">Inches</option>
          <option value="Feet">Feet</option>
          <option value="Yards">Yards</option>
          <option value="Miles">Miles</option>
          <option value="NauticalMiles">NauticalMiles</option>
        </select>
        <label htmlFor="outsideOnly">바깥쪽만 버퍼 <AnalHelp analName="MultipleRingBuffer" propName="outsideOnly"/></label>
        <select 
          id="outsideOnly" 
          {...register("outsideOnly")} 
          defaultValue={'true'}
        >
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <label htmlFor="dissolve">디졸브 여부 <AnalHelp analName="MultipleRingBuffer" propName="dissolve"/></label>
        <select 
          id="dissolve" 
          {...register("dissolve")} 
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

export default MultipleRingBuffer;