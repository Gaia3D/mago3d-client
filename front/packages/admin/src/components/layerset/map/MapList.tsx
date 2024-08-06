import {useMutation} from "@apollo/client";
import {LayersetReloadRemoteAssetDocument} from "@src/generated/gql/layerset/graphql";
import {useTranslation} from "react-i18next";

const MapList = () => {
  const { t } = useTranslation();
  const [mutation] = useMutation(LayersetReloadRemoteAssetDocument);

  const reloadMap = (layerKey: string) => {
    console.info(layerKey);
    mutation({
      variables: {
        layerKey
      }
    }).then(() => {
      alert(t("success.renewal-map"));
      // getClient().invalidateQueries({ queryKey: ['assets', searchProps] })
      // navigate(-1);
    });
  }

  return (
    <div className="contents">
      <h2>{t("map")}</h2>
      <ul className="map-form">
        <li className="map-general">
          <button type="button" className="btn-update" onClick={() => reloadMap('baroemap')}>{t("renewal")}</button>
          <h5>{t("standard-map")}</h5>
          <span className="txt">{t("ngii")}(EPSG:5179)</span>
        </li>
        <li className="map-hybrid">
          <button type="button" className="btn-update" onClick={() => reloadMap('baroesat')}>{t("renewal")}</button>
          <h5>{t("hybrid-map")}</h5>
          <span className="txt">{t("ngii")}(EPSG:5179)</span>
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