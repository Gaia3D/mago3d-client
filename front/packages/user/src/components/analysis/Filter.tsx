import { FilterLayerState, FilterLayerProps } from '@/recoils/Analysis';
import { LoadingStateType, loadingState } from '@/recoils/Spinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const requestXML = (layerName:string, field:string) => {
  return `<wps:Execute
	xmlns:wps="http://www.opengis.net/wps/1.0.0"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:ows="http://www.opengis.net/ows/1.1"
	xmlns:wfs="http://www.opengis.net/wfs"
	xmlns:wcs="http://www.opengis.net/wcs/1.1.1"
	xmlns:xsi="http://www.w3.org//2001/XMLSchema-instance"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
	<ows:Identifier>gs:Unique</ows:Identifier>
	<wps:DataInputs>
		<wps:Input>
			<ows:Identifier>features</ows:Identifier>
			<wps:Reference xlink:href="http://geoserver/wfs" method="POST" mimeType="application/xml">
				<wps:Body>
					<wfs:GetFeature service="WFS" version="1.1.0" outputFormat="GML3">
						<wfs:Query typeName="${layerName}"/>
					</wfs:GetFeature>
				</wps:Body>
			</wps:Reference>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>attribute</ows:Identifier>
			<wps:Data>
				<wps:LiteralData>${field}</wps:LiteralData>
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
export default function AnalysisFilter () {
  const [filterLayer, setFilterLayer] = useRecoilState<FilterLayerProps | null>(FilterLayerState);
  const setloading = useSetRecoilState<LoadingStateType>(loadingState);
	const [ filter, setFilter ] = useState<string | null>(null);
	const [ selField, setSelField ] = useState<string | null>(null);
  
  useEffect(() => {
    if(filterLayer && filterLayer.defaultFilter) setFilter(filterLayer.defaultFilter);
    return () => {
      setFilter(null);
      setSelField(null);
    }
  }, [filterLayer]);
  // console.info('filterLayer', filterLayer)
  const { data:fields } = useQuery({
    queryKey: ['layerFields', filterLayer?.layerName],
    queryFn: () => axios.get(`https://mdtp.gaia3d.com/geoserver/ows?service=WFS&VERSION=1.1.0&request=DescribeFeatureType&TYPENAME=mdtp:${filterLayer?.layerName}&outputFormat=application/json`),
    enabled: !!filterLayer?.layerName,
    select: (data) => data.data.featureTypes[0].properties
  });

  const { data:sampleValues, isLoading:isLoadingSampleValues } = useQuery({
    queryKey: ['sampleValues',filterLayer?.layerName, selField],
    queryFn: () => axios.post(`https://mdtp.gaia3d.com/geoserver/wps`, requestXML(filterLayer?.layerName as string, selField as string), {
			headers: {
				'Content-Type': 'text/xml;charset=utf-8'
			}}
    ),
    enabled: !!filterLayer && !!filterLayer?.layerName && !!selField,
    select: (data) => data.data.features
  });

  useEffect(() => {
    setloading({loading: isLoadingSampleValues, msg: '샘플값을 불러오는 중입니다.'})
  }, [isLoadingSampleValues])
  
  const updateFilter = () => {
    filterLayer?.setFilter(filter);
    setFilterLayer(null);
  }
  const addFilterVal = (val: string, type: string): void => {
    if(type === 'field'){
      console.info('field', val)
      setSelField(val);
    }
    setFilter(filter + ' ' + val);
  }
  if (!filterLayer) return null;
  
  const operators = ['=', '<', '>', '<=', '>=', '!=', '%', 'LIKE', 'ILIKE', 'IN', 'NOT IN', 'AND', 'OR', 'NOT'];
	return(
    <div className="dialog-registerPoint darkMode" style={{width: 500}}>
      <div className="dialog-title">
        <h3>{filterLayer.fieldName} 필터</h3>
        <button className="close floatRight" onClick={()=>{setFilterLayer(null)}}></button>						
      </div>
      <div className="height-95 yScroll">
        <div style={{ float:'left', width: '40%'}}>
          <p style={{color:'white', textAlign: 'left', marginLeft: 20, fontSize: 14}}>필드</p>
          <ul style={{ width: '100%', textAlign: 'left', padding: 10, border: '1px solid white', margin: '10px 20px', maxHeight: 200, minHeight: 25, overflow: 'auto'}}>
            {fields && fields.map((field:any, idx:number) => {
              if(field.name !== 'geom' && field.type.indexOf('gml') === -1){
                return(
                  <li key={idx} style={{color:'white', cursor: 'pointer', borderBottom: '1px solid lightgray'}} onClick={() => addFilterVal(field.name, 'field')}>
                    {field.name}
                  </li>
                )
              }
            })}
          </ul>
        </div>
        <div style={{ float:'left', width: '40%', marginLeft:30}}>
          <p style={{color:'white', textAlign: 'left', marginLeft: 20, fontSize: 14}}>샘플 값</p>
          <ul style={{ width: '100%', textAlign: 'left', padding: 10, border: '1px solid white', margin: '10px 20px', maxHeight: 200, minHeight: 25, overflow: 'auto'}}>
            {sampleValues && sampleValues.map((feature:any, idx:number) => {
              if(selField){
                return(
                  <li key={idx} style={{color:'white', cursor: 'pointer', borderBottom: '1px solid lightgray'}} onClick={() => addFilterVal(feature.properties.value, 'value')}>
                    {feature.properties.value}
                  </li>
                )
              }
            })}
          </ul>
        </div>
        <div style={{float:'left', width: 'calc(100% - 45px)'}}>
          <p style={{color:'white', width: '100%', textAlign: 'left', marginLeft: 20, fontSize: 14}}>연산자</p>
          <div className="darkMode-btn" style={{ width: '100%', float: 'none', textAlign: 'left', padding: 10, border: '1px solid white', margin: '10px 20px', overflow: 'auto'}}>
            {operators.map((operator, idx) => (
              <button key={idx} className="cancel" style={{margin:'5px 3px'}} onClick={() => addFilterVal(operator, 'opertator')}><a>{operator}</a></button>
            ))}
          </div>
        </div>
        <textarea 
          name="explain" 
          value={filter ?? ''}
          onChange={(e) => setFilter(e.target.value)}
          style={{minWidth:450, maxWidth: 450, marginTop: 10, height: 50}}
          placeholder="필터"/>
      </div>
      <div className="darkMode-btn">
        <button type="button" className="register" onClick={updateFilter}><a>등록</a></button>
        <button type="button" className="cancel" onClick={()=>{setFilterLayer(null)}}><a>닫기</a></button>
      </div>
    </div>
	)
}