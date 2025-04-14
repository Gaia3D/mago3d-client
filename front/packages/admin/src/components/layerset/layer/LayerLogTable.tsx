import { useTranslation } from "react-i18next";
import { dataFormatter } from "@mnd/shared";
import {LayerAssetLog} from "@src/generated/gql/layerset/graphql";

interface LayerLogTableProps {
  logs: LayerAssetLog[];
}

const LayerLogTable = ({ logs }: LayerLogTableProps) => {
  const { t } = useTranslation();

  return (
    <>
      <label>{t("publish-record")}</label>
      <div className="cboth list03-sort title-inner">
        <table>
          <caption>{t("record")}</caption>
          <thead>
          <tr>
            <th>{t("content")}</th>
            <th>{t("type")} <a className="sort" href="#"></a></th>
            <th>{t("created-at")} <a className="sort" href="#"></a></th>
          </tr>
          </thead>
        </table>
      </div>
      <div className="list03-sort s-inner" style={{ height: "300px" }}>
        <table>
          <tbody>
          {logs.map((history, idx) => (
            <tr key={idx}>
              <td>{history.content}</td>
              <td className="tleft">{history.type}</td>
              <td>{dataFormatter(history.createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LayerLogTable;
