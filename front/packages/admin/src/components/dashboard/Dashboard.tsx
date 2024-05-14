import { ChangeEvent, useEffect, useState } from "react";
import IframeContainer from "./IframeContainer";
import { DashboardType, OptionsType, UrlListType } from "../../types/Dashboard";

function Dashboard() {
  const urlListGenerator = (type: DashboardType): UrlListType => {
    const baseUrl: string = import.meta.env.VITE_DASHBOARD_URL;
    const commonPath: string = "/jvm-micrometer";
    const commonParams: string = `orgId=1&refresh=30s&var-application=${type}&var-instance=${type}:8080&var-jvm_memory_pool_heap=All&var-jvm_memory_pool_nonheap=All&var-jvm_buffer_pool=All&theme=light`;
    return {
      upTime: `${baseUrl}${commonPath}?${commonParams}&panelId=63`,
      startTime: `${baseUrl}${commonPath}?${commonParams}&panelId=92`,
      jvmTotal: `${baseUrl}${commonPath}?${commonParams}&panelId=26`,
      cpuUsage: `${baseUrl}${commonPath}?${commonParams}&panelId=106`,
      logEvents: `${baseUrl}${commonPath}?${commonParams}&panelId=91`,
      rate: `${baseUrl}${commonPath}?${commonParams}&panelId=111`,
      errors: `${baseUrl}${commonPath}?${commonParams}&panelId=112`,
    };
  };

  const bbsUrl: UrlListType = urlListGenerator("bbs");
  const dataSetUrl: UrlListType = urlListGenerator("dataset");
  const layerSetUrl: UrlListType = urlListGenerator("layerset");
  const searchUrl: UrlListType = urlListGenerator("search");
  const timeSeriesUrl: UrlListType = urlListGenerator("timeseries");

  const [selectedSrcList, setSelectedSrcList] = useState<UrlListType>(
    {} as UrlListType
  );

  const options: OptionsType[] = [
    {
      key: "BBS",
      name: "게시판 관리 어플리케이션",
      url: bbsUrl,
    },
    {
      key: "DataSet",
      name: "데이터 관리 어플리케이션",
      url: dataSetUrl,
    },
    {
      key: "LayerSet",
      name: "레이어 관리 어플리케이션",
      url: layerSetUrl,
    },
    {
      key: "Search",
      name: "검색 관리 어플리케이션",
      url: searchUrl,
    },
    {
      key: "TimeSeries",
      name: "시계열 관리 어플리케이션",
      url: timeSeriesUrl,
    },
  ];
  useEffect(() => {
    setSelectedSrcList(options[0].url);
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    const targetOption = options.find(
      (option) => option.key === selectedOption
    );
    setSelectedSrcList(targetOption.url);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>대시보드</h1>
        <select onChange={handleSelectChange}>
          {options.map((option, index) => {
            return (
              <option value={option.key} key={index}>
                {option.name}
              </option>
            );
          })}
        </select>
      </div>
      <IframeContainer srcList={selectedSrcList} />
    </div>
  );
}

export default Dashboard;
