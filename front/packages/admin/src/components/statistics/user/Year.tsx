import IframeBox from "../common/IframeBox";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedYearState } from "../../../recoils/Statistics";
import { yearConverter } from "../common/TimeConverter";

function Year() {
  const selectedYear = useRecoilValue(selectedYearState);

  const [chartSrc, setChartSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/ff957b80-b41a-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-5y,to:now))`
  );
  const [tableSrc, setTableSrc] = useState(
    `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/9b25b380-b41b-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-5y,to:now))`
  );

  useEffect(() => {
    const { from, to } = yearConverter(selectedYear);

    setChartSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/ff957b80-b41a-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-${from}y,to:now-${to}y))`
    );
    setTableSrc(
      `${import.meta.env.VITE_API_URL}/opensearch-dashboard/app/visualize#/edit/9b25b380-b41b-11ee-b0a6-d9651ad742a4?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-${from}y,to:now-${to}y))`
    );
  }, [selectedYear]);

  return (
    <>
      <IframeBox id="yearBarChart" width="100%" height="600" src={chartSrc} />
      <IframeBox id="yearTable" width="100%" height="600" src={tableSrc} />
    </>
  );
}
export default Year;
