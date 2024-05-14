import { AnalysisFeatureLayer, DefaultAnalysisLayer } from "@/api/DefaultAnalysisLayer";
import { useAnalGeometryDraw } from "./useAnalGeometryDraw";
import { Math } from "cesium";
import axios from "axios";

export type AnalLayerInputProps = {
  name: string;
  layerName: string;
  type: 'coverage' | 'feature',
  filter?: string;
}
export type AnalValueInputProps = {
  name: string;
  value: string;
  type?: 'cql' | 'literal' | 'wkt';
}
export type AnalReqXmlProps = {
  analName: string;
  maskWkt: string;
  responseType : 'json'
  lowerCorner: string;
  upperCorner: string;
  layers: AnalLayerInputProps[];
  values?: AnalValueInputProps[];
}

export const useAnalSpace = (analName:string) => {
  const {clearCropShape, cropShape, globeController, drawType, setResultEntityIds, toggleDrawType, clearResultEntityIds} = useAnalGeometryDraw({});

  const layersInfo:AnalysisFeatureLayer = DefaultAnalysisLayer[analName];
  const layersInfoKeys = Object.keys(layersInfo);
  const layerNames = layersInfoKeys.map((key) => { 
      const feature = layersInfo[key];
      if (typeof feature === 'string') return '';

      return feature.name
  });

  const LIKE_RASTER_LAYER = ['경사도래스터', '사면향래스터', '속도래스터', '음영기복래스터', '표고래스터', '표고래스터30M'];
  const LIKE_POLYGON_LAYER = ['비무장지대', '식생도', '토지피복도', '토질도'];
  const LIKE_LINE_LAYER = ['송전선', '수송도도로링크','수송도철도중심선'];

  const getCurrentExtent = () => {
      const { viewer } = globeController;
      if (!viewer) return;
      const extent = viewer.camera.computeViewRectangle();
      return extent;
  }

  const getConner = () => {
      const extent = getCurrentExtent();
      if (!extent) return {
          bboxLowerCorner: `126.96702275179422 37.532877773088174`,
          bboxUpperCorner: `126.97408750946124 37.539243842600044`
      };
      const { west, south, east, north } = extent;
      return {
          bboxLowerCorner: `${Math.toDegrees(west)} ${Math.toDegrees(south)}`,
          bboxUpperCorner: `${Math.toDegrees(east)} ${Math.toDegrees(north)}`
      }
  }

  const getCoverageXml = (layerProps:AnalLayerInputProps, lowerCorner:string, upperCorner:string) => {
    const {layerName, name,} = layerProps;
    return `<wps:Input>
    <ows:Identifier>${name}</ows:Identifier>
    <wps:Reference xlink:href="http://geoserver/wcs" method="POST" mimeType="image/tiff">
      <wps:Body>
        <wcs:GetCoverage service="WCS" version="1.1.1">
          <ows:Identifier>${layerName}</ows:Identifier>
          <wcs:DomainSubset>
            <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
              <ows:LowerCorner>${lowerCorner}</ows:LowerCorner>
              <ows:UpperCorner>${upperCorner}</ows:UpperCorner>
            </ows:BoundingBox>
          </wcs:DomainSubset>
          <wcs:Output format="image/tiff"/>
        </wcs:GetCoverage>
      </wps:Body>
    </wps:Reference>
  </wps:Input>`
  }

  const getFeatureXml = (layerProps:AnalLayerInputProps, lowerCorner:string, upperCorner:string) => {
    const {layerName, name, filter} = layerProps;
    return `<wps:Input>
    <ows:Identifier>${name}</ows:Identifier>
    <wps:Reference xlink:href="http://geoserver/wfs" method="POST" mimeType="application/xml">
      <wps:Body>
        <wfs:GetFeature service="WFS" version="1.1.0" outputFormat="GML3">
          <wfs:Query typeName="mdtp:${layerName}">
            ${createFilterXml(filter, lowerCorner, upperCorner)}
          </wfs:Query>
        </wfs:GetFeature>
      </wps:Body>
    </wps:Reference>
  </wps:Input>`
  }

  const getLiteralXml = (value:AnalValueInputProps) => {
    return `<wps:Input>
      <ows:Identifier>${value.name}</ows:Identifier>
      <wps:Data>
        <wps:LiteralData>${value.value}</wps:LiteralData>
      </wps:Data>
    </wps:Input>`
  }

  const getCqlXml = (value:AnalValueInputProps) => {
    return `<wps:Input>
      <ows:Identifier>${value.name}</ows:Identifier>
      <wps:Data>
        <wps:ComplexData mimeType="text/plain; subtype=cql">${value.value}</wps:ComplexData>
      </wps:Data>
    </wps:Input>`
  }

  const getWktXml = (value:AnalValueInputProps) => {
    return `<wps:Input>
      <ows:Identifier>${value.name}</ows:Identifier>
      <wps:Data>
        <wps:ComplexData mimeType="application/wkt">${value.value}</wps:ComplexData>
      </wps:Data>
    </wps:Input>`
  }

  const craeteXml = (props:AnalReqXmlProps):string => {
    const {analName, layers, lowerCorner, upperCorner, maskWkt, values, responseType} = props;
    return `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xsi="http://www.w3.org//2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" service="WPS" version="1.0.0">
    <ows:Identifier>${analName}</ows:Identifier>
    <wps:DataInputs>
      ${layers.map((layer) => {
        if (layer.type === 'coverage') {
          return getCoverageXml(layer, lowerCorner, upperCorner);
        } else {
          return getFeatureXml(layer, lowerCorner, upperCorner);
        }
      }).join('')}
      ${
        values ? values.map((value) => {
          if (value.type === 'cql') {
            return getCqlXml(value);
          } else if (value.type === 'wkt') {
            return getWktXml(value);
          } else {
            return getLiteralXml(value);
          }
        }).join('')
        : ''
      }
      <wps:Input>
        <ows:Identifier>maskArea</ows:Identifier>
        <wps:Data>
          <wps:ComplexData mimeType="application/wkt">${maskWkt}</wps:ComplexData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier>result</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>
    `
  }

  const createFilterXml = (filter:string | undefined, lowerCorner:string, upperCorner:string) => {
    const bboxXml = `<ogc:BBOX>
      <ogc:PropertyName>geom</ogc:PropertyName>
      <gml:Envelope srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
        <gml:lowerCorner>${lowerCorner}</gml:lowerCorner>
        <gml:upperCorner>${upperCorner}</gml:upperCorner>
      </gml:Envelope>
    </ogc:BBOX>`;
    if (!filter) return `<ogc:Filter>${bboxXml}</ogc:Filter>`;
    else {
      return `<ogc:Filter><ogc:And>
        ${filter}
        ${bboxXml}
      </ogc:And></ogc:Filter>`
    }
  }

  const retFilterXml = async (filterString:string | null, key:string): Promise<string | undefined> => {
    if (!filterString) return;
    const data:any = {};
    data[key] = btoa(filterString);

    const filterToXml = await axios.post(`${import.meta.env.VITE_API_URL}/app/api/sqlparser/icmtc/cqlToXml`, data)
    const filterXml = filterToXml.data;

    if (filterXml.code !== 200) throw new Error('필터 변환에 실패하였습니다.');

    const filterXmlData = filterXml.data;
    if (!Object.prototype.hasOwnProperty.call(filterXmlData, key)) return;

    const xmlParser = new DOMParser();
    const xmlDoc = xmlParser.parseFromString(filterXmlData[key], 'text/xml');
    const filterDoc = xmlDoc.getElementsByTagName('ogc:Filter')[0].childNodes[0];
    
    const serializer = new XMLSerializer();
    
    return serializer.serializeToString(filterDoc);
  }
  return {
    clearCropShape,
    cropShape,
    drawType,
    layerNames,
    toggleDrawType,
    setResultEntityIds,
    getConner,
    layersInfoKeys,
    globeController,
    LIKE_RASTER_LAYER,
    LIKE_POLYGON_LAYER,
    LIKE_LINE_LAYER,
    clearResultEntityIds,
    craeteXml,
    retFilterXml
  }
}