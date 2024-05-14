import IframeBox from "../common/IframeBox";
import { useRecoilValue } from "recoil";
import { selectedDateState } from "@src/recoils/Statistics";
import { useEffect, useState } from "react";
import { monthOrDayConverter } from "@src/components/statistics/common/TimeConverter";

function Statistics() {
  const selectedDay = useRecoilValue(selectedDateState);
  const [chartSrc, setChartSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/dashboards#/view/d07f52f0-b42c-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))&hide-filter-bar=true`
  );

  useEffect(() => {
    const { from, to } = monthOrDayConverter(selectedDay, "day");
    setChartSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/dashboards#/view/d07f52f0-b42c-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${from}',to:'${to}'))&hide-filter-bar=true`
    );
  }, [selectedDay]);

  return (
    <>
      <IframeBox id="service" width="100%" height="650" src={chartSrc} />
    </>
  );
}
export default Statistics;
