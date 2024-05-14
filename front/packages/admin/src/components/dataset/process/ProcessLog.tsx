import {AppLoader} from "@mnd/shared";
import {Suspense} from "react";
import {DatasetProcessLogDocument, Process} from "@src/generated/gql/dataset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import ProcessLogItem from "./ProcessLogItem";

const ProcessLog = (props: {
  assetId: string
  onProcessChange?: (process: Process) => void
  resetProcess?: () => void
}) => {
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
        <h3>이력</h3>
        <div className="list04-logs title-inner">
          <table>
            <caption>이력</caption>
            <thead>
            <tr>
              <th>변환명 <a className="sort" href="#"></a></th>
              <th>상태 <a className="sort" href="#"></a></th>
              <th>메세지 <a className="sort" href="#"></a></th>
              <th>등록일 <a className="sort" href="#"></a></th>
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
                    <td colSpan={4} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                  </tr>
            }
            </tbody>
          </table>
        </div>
      </Suspense>
  )
}
export default ProcessLog;