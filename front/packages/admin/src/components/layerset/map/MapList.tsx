import {useMutation} from "@apollo/client";
import {LayersetReloadRemoteAssetDocument} from "@src/generated/gql/layerset/graphql";

const MapList = () => {

  const [mutation] = useMutation(LayersetReloadRemoteAssetDocument);

  const reloadMap = (layerKey: string) => {
    console.info(layerKey);
    mutation({
      variables: {
        layerKey
      }
    }).then(() => {
      alert('성공적으로 갱신되었습니다. 지도페이지에서 브라우저를 새로고치면 적용됩니다.');
      // getClient().invalidateQueries({ queryKey: ['assets', searchProps] })
      // navigate(-1);
    });
  }

  return (
    <div className="contents">
      <h2>지도</h2>
      <ul className="map-form">
        <li className="map-general">
          <button type="button" className="btn-update" onClick={() => reloadMap('baroemap')}>갱신</button>
          <h5>일반지도</h5>
          <span className="txt">국토지리정보원(EPSG:5179)</span>
        </li>
        <li className="map-hybrid">
          <button type="button" className="btn-update" onClick={() => reloadMap('baroesat')}>갱신</button>
          <h5>하이브리드지도</h5>
          <span className="txt">국토지리정보원(EPSG:5179)</span>
        </li>
        {/*
                <li className="map-terrain">
                    <button type="button" className="btn-update">수정</button>
                    <h5>지형(Terrain)지도</h5>
                    <span className="txt">지형정보단(EPSG:4326)</span>
                </li>
                */}
      </ul>
    </div>
  )
}

export default MapList;