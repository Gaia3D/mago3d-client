import IframeBox from "../common/IframeBox";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedDateState } from "../../../recoils/Statistics";
import { monthOrDayConverter } from "../common/TimeConverter";

function Day() {
  const selectedDay = useRecoilValue(selectedDateState);
  const [pieChartSrc, setPieChartSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/96506310-b42e-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))`
  );
  const [barChartSrc, setBarChartSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/2bf6ec80-793e-11ee-945d-5f362d572157?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))`
  );
  useEffect(() => {
    const { from, to } = monthOrDayConverter(selectedDay, "day");

    setPieChartSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/96506310-b42e-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${from}',to:'${to}'))`
    );

    setBarChartSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/2bf6ec80-793e-11ee-945d-5f362d572157?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${from}',to:'${to}'))`
    );
  }, [selectedDay]);

  return (
    <>
      <IframeBox id="pieChart" width="100%" height="600" src={pieChartSrc} />
      <IframeBox
        id="statusBarChart"
        width="100%"
        height="600"
        src={barChartSrc}
      />
    </>
  );
}
export default Day;
