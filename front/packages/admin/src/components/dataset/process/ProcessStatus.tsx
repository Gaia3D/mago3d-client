import {ProcessTaskStatus} from "@src/generated/gql/dataset/graphql";
import {getProcessStatusCssName} from "@src/api/Data";
import {useTranslation} from "react-i18next";

export function ProcessStatus(props: { status: ProcessTaskStatus }) {
  const {t} = useTranslation();
  const text = props.status ? props.status : 'ready';
  const clsName = props.status ? getProcessStatusCssName(props.status) : 'btn-s-ready';
  return (
    <button type="button" className={clsName}>{t(text)}</button>
  )
}