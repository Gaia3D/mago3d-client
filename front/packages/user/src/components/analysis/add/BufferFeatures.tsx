import { useAnalSpace } from "@/hooks/useAnalSpace";
import { LIKE_POINT_LAYER_NAMES } from "../AdditionalSpace";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useAnalResult } from "@/hooks/useAnalResult";
import { ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import AnalHelp from "../AnalInfo";

const requestXML = (payload:Payload) => {
    const { distance, bboxLowerCorner, bboxUpperCorner, distanceUnit, endCapStyle, inputFeatures, joinStyle, quadrantSegments} = payload;
    
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>statistics:BufferFeatures</ows:Identifier>
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
			<ows:Identifier>distance</ows:Identifier>
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
			<ows:Identifier>quadrantSegments</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${quadrantSegments}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>endCapStyle</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${endCapStyle}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>joinStyle</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${joinStyle}</wps:LiteralData>
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
  quadrantSegments: number;
  endCapStyle: string;
  joinStyle: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
}
const BufferFeatures = () => {
  const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
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
          layerName: '버퍼',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#19AFED',
          fillOpacity: 0.7,
          lineColor: '#FFffff',
          lineOpacity: 1,
          lineWidth: 3,
          isCustom: false
        }
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="inputFeatures">입력 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="BufferFeatures" propName="inputFeatures"/>
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
        <label htmlFor="distance">거리 표현식 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="BufferFeatures" propName="distance"/>
        </label>
        <input type="text" id="distance"
          {...register("distance")} 
          defaultValue="10"
        />
        <label htmlFor="distanceUnit">거리 단위 <AnalHelp analName="BufferFeatures" propName="distanceUnit"/></label>
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
        <label htmlFor="quadrantSegments" style={{fontSize:'11px'}}>사분면의 세그먼트 수 <AnalHelp analName="BufferFeatures" propName="quadrantSegments"/></label>
        <input type="text" id="quadrantSegments"
          {...register("quadrantSegments")} 
          defaultValue="24"
        />
        <label htmlFor="endCapStyle">선끝 스타일 <AnalHelp analName="BufferFeatures" propName="endCapStyle"/></label>
        <select 
          id="endCapStyle" 
          {...register("endCapStyle")} 
          defaultValue={'Round'}
        >
          <option value="Round">Round</option>
          <option value="Flat">Flat</option>
          <option value="Square">Square</option>
        </select>
        <label htmlFor="joinStyle">조인 스타일 <AnalHelp analName="BufferFeatures" propName="joinStyle"/></label>
        <select 
          id="joinStyle" 
          {...register("joinStyle")} 
          defaultValue={'Round'}
        >
          <option value="Round">Round</option>
          <option value="Mitre">Mitre</option>
          <option value="Bevel">Bevel</option>
        </select>
        <div className="btn clearBoth marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}

export default BufferFeatures;