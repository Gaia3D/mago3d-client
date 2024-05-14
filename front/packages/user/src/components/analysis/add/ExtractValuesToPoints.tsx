import { useAnalSpace } from "@/hooks/useAnalSpace";
import { LIKE_POINT_LAYER_NAMES } from "../AdditionalSpace";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { AnalysisLayer, ResultLayerDataType, ResultLayerStepType, analysisLayersState } from "@/recoils/Analysis";
import axios from "axios";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

const requestXML = (payload:Payload) => {
    const { pointFeatures, valueCoverage, valueField, valueType, bboxLowerCorner, bboxUpperCorner} = payload;
    
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>statistics:ExtractValuesToPoints</ows:Identifier>
	<wps:DataInputs>
		<wps:Input>
			<ows:Identifier>pointFeatures</ows:Identifier>
			<wps:Reference xlink:href="http://geoserver/wfs" method="POST" mimeType="application/xml">
				<wps:Body>
					<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2">
						<wfs:Query typeName="${pointFeatures}">
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
			<ows:Identifier>valueField</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${valueField}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>valueCoverage</ows:Identifier>
			<wps:Reference xlink:href="http://geoserver/wcs" method="POST" mimeType="image/tiff">
				<wps:Body>
					<wcs:GetCoverage xmlns:wcs="http://www.opengis.net/wcs/1.1.1" service="WCS" version="1.1.1">
						<ows:Identifier>${valueCoverage}</ows:Identifier>
						<wcs:DomainSubset>
							<ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
                                <ows:LowerCorner>${bboxLowerCorner}</ows:LowerCorner>
                                <ows:UpperCorner>${bboxUpperCorner}</ows:UpperCorner>
							</ows:BoundingBox>
						</wcs:DomainSubset>
						<wcs:Output format="image/tiff"/>
					</wcs:GetCoverage>
				</wps:Body>
			</wps:Reference>
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
</wps:Execute>`;
}

type Payload = {
  pointFeatures: string;
  valueField: string;
  valueCoverage: string;
  valueType: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
}
const ExtractValuesToPoints = () => {
  const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
  const {getConner, globeController, setResultEntityIds, clearResultEntityIds} = useAnalSpace('statistics:FrozenArea');
  const analysisLayers = useRecoilValue<AnalysisLayer[]>(analysisLayersState);
  const {analysisFeatureCollection} = useAnalResult();


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
        layerName: '포인트에 래스터 셀값 계산',
        changable: true,
        step: ResultLayerStepType.SIMPLIFY,
        type: ResultLayerDataType.Entity,
        fillColor: '#FF7500',
        fillOpacity: 0.7,
        lineColor: '#FFF',
        lineOpacity: 0.7,
        isCustom: false
      }
    });

    /* console.info(data);
    
    const analysis = await axios.post(import.meta.env.VITE_GEOSERVER_WPS_SERVICE_URL, requestXML(data), {
      headers: {
        'Content-Type': 'application/xml;charset=utf-8'
      }
    })
    console.info(analysis); */
    
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="pointFeatures">포인트 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="ExtractValuesToPoints" propName="pointFeatures"/>
        </label>
        <select 
          id="pointFeatures" 
          {...register("pointFeatures")} 
        >
        {
          LIKE_POINT_LAYER_NAMES.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="valueField">계산될 필드 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="ExtractValuesToPoints" propName="valueField"/>
        </label>
        <input type="text" id="valueField"
          {...register("valueField")} 
          value="rasterval"
        />
        <label htmlFor="valueCoverage">래스터 레이어 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="ExtractValuesToPoints" propName="valueCoverage"/>
        </label>
        <select 
          id="valueCoverage" 
          {...register("valueCoverage")} 
        >
        {
          analysisLayers.map((item, idx) => {
            return (
              <option value={item.name} key={idx}>{item.name}</option>
            )
          })
        }
        </select>
        <label htmlFor="valueType">셀값 계산 유형 <AnalHelp analName="ExtractValuesToPoints" propName="valueType"/></label>
        <select 
          id="valueType" 
          {...register("valueType")} 
        >
          <option value="Default">기본값</option>
          <option value="SlopeAsDegree">도단위의 경사값</option>
          <option value="SlopeAsPercentrise">퍼센트단위의 경사값</option>
          <option value="Aspect">사면 향</option>
        </select>
        <div className="btn marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}

export default ExtractValuesToPoints;