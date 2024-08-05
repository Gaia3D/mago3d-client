import {AppLoader} from "@mnd/shared";
import {Suspense} from "react";
import {DatasetProcessLogDocument, Process} from "@src/generated/gql/dataset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import ProcessLogItem from "./ProcessLogItem";
import {useTranslation} from "react-i18next";

const ProcessLog = (props: {
  assetId: string
  onProcessChange?: (process: Process) => void
  resetProcess?: () => void
}) => {
  const { t } = useTranslation();
  const {onProcessChange, resetProcess} = props;

  const {data: {processes}} = useSuspenseQuery(DatasetProcessLogDocument, {
    variables: {
      assetId: props.assetId
    },
    pollInterval: 5000,
    fetchPolicy: 'cache-and-network',
  });
  const {items} = processes;

  const setTableStyle = () => {
    if (items?.length >= 8) {
        return;
    }
    return {paddingRight: "10px"}
  }

  return (
      <Suspense fallback={<AppLoader/>}>
        <h3>{t("record")}</h3>
        <div className="list04-logs title-inner">
          <table>
            <caption>{t("record")}</caption>
            <thead>
            <tr>
              <th>{t("transform-name")} <a className="sort" href="#"></a></th>
              <th>{t("status")} <a className="sort" href="#"></a></th>
              <th>{t("message")} <a className="sort" href="#"></a></th>
              <th>{t("created-at")} <a className="sort" href="#"></a></th>
            </tr>
            </thead>
          </table>
        </div>
        <div className="list04-logs s-inner" style={setTableStyle()}>
          <table>
            <tbody>
            {
              items?.length > 0 ?
                  items.map((process) => {
                    return <ProcessLogItem key={process.id} processItem={process as Process} onProcessChange={onProcessChange} resetProcess={resetProcess}/>;
                  })
                  :
                  <tr>
                    <td colSpan={4} style={{textAlign: "center"}}>{t("not-found.data")}</td>
                  </tr>
            }
            </tbody>
          </table>
        </div>
      </Suspense>
  )
}
export default ProcessLog;