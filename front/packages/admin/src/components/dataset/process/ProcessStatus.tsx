import {ProcessTaskStatus} from "@src/generated/gql/dataset/graphql";
import {getProcessStatusCssName, getProcessStatusName} from "@src/api/Data";

export function ProcessStatus(props: {
  status: ProcessTaskStatus
}) {
  const text = props.status ? getProcessStatusName(props.status) : '준비';
  const clsName = props.status ? getProcessStatusCssName(props.status) : 'btn-s-ready';
  return (
    <button type="button" className={clsName}>{text}</button>
  )
}