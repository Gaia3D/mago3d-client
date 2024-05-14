import { useEffect, useState } from "react";
import IframeBox from "../common/IframeBox";
import { useRecoilValue } from "recoil";
import { selectedMonthState } from "../../../recoils/Statistics";
import { currentYear, monthOrDayConverter } from "../common/TimeConverter";

function Month() {
  const selectedMonth = useRecoilValue(selectedMonthState);

  const [chartSrc, setChartSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/b35c6520-b434-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${
      currentYear - 1
    }-12-31T15:00:00.000Z',to:'${currentYear}-12-31T14:30:00.000Z'))`
  );
  const [tableSrc, setTableSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/403cd920-b435-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${
      currentYear - 1
    }-12-31T15:00:00.000Z',to:'${currentYear}-12-31T14:30:00.000Z'))`
  );

  useEffect(() => {
    const { from, to } = monthOrDayConverter(selectedMonth, "month");
    setChartSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/b35c6520-b434-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${from}',to:'${to}'))`
    );
    setTableSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/403cd920-b435-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${from}',to:'${to}'))`
    );
  }, [selectedMonth]);

  return (
    <>
      <IframeBox id="monthBarChart" width="100%" height="600" src={chartSrc} />
      <IframeBox id="monthTable" width="100%" height="600" src={tableSrc} />
    </>
  );
}
export default Month;
