import {AppLoader, dataFormatter} from "@mnd/shared";
import {Suspense, useState} from "react";
import {getProcessStatusName} from "@src/api/Data";
import {DatasetProcessDocument, Process, ProcessTask} from "@src/generated/gql/dataset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import DetailProcessLog from "./DetailProcessLog";

const ProcessLogItem = (props: {
  processItem: Process
  onProcessChange?: (process: Process) => void
  resetProcess?: () => void
}) => {
  const {processItem, onProcessChange, resetProcess} = props;

  const [processId, setProcessId] = useState<string>(processItem.id);
  const {data: {process}} = useSuspenseQuery(DatasetProcessDocument, {
    variables: {
      id: processId,
    },
  });

  const handleProcessClick = (id: string) => {
    setProcessId(id);
    onProcessChange(process as Process);
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [stacktrace, setStacktrace] = useState<string>('');

  const detailTask = (task: ProcessTask) => {
    // td를 클릭했을 때 해당 태스크의 상세정보를 보여주는 모달을 띄움
    if (!task.error && !task.stacktrace) return;
    setIsOpen(true);
    setError(task.error ?? '');
    setStacktrace(task.stacktrace ?? '');
  };

  return (
      <Suspense fallback={<AppLoader/>}>
        <tr key={processItem.id} onClick={() => handleProcessClick(processItem.id)}>
          <td>{processItem.name}</td>
          <td>{getProcessStatusName(processItem.status)}</td>
          {
            processItem.tasks.map((task, index) => {
              return (
                  <td key={task.id} rowSpan={(index == 0) ? processItem.tasks.length : 0}
                      onClick={() => detailTask(task)}>
                    <div style={{width: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{task.stacktrace}</div>
                    <div style={{width: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{task.error}</div>
                  </td>
              )
            })
          }
          <td>{dataFormatter(processItem.createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
        {
            isOpen && <DetailProcessLog error={error} stacktrace={stacktrace} onClose={() => setIsOpen(false)}/>
        }
      </Suspense>
  )
}
export default ProcessLogItem;