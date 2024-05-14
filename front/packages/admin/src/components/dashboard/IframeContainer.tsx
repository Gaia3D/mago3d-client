import { UrlListType } from "../../types/Dashboard";

interface IframeContainerProps {
  srcList: UrlListType;
}

function IframeContainer({ srcList }: IframeContainerProps) {
  return (
    <div className="dashboard-content">
      <div className="content-01">
        <span>Quick Facts</span>
        <div className="content-wrapper">
          <iframe src={srcList.upTime} width="445" height="200" className="chart"></iframe>
          <iframe src={srcList.startTime} width="445" height="200" className="chart"></iframe>
        </div>
      </div>
      <div className="content-02">
        <span>JVM Memory</span>
        <div className="content-wrapper">
          <iframe src={srcList.jvmTotal} width="600" height="200" className="chart"></iframe>
        </div>
      </div>
      <div className="content-03">
        <span>JVM Misc</span>
        <div className="content-wrapper">
          <iframe src={srcList.cpuUsage} width="750" height="230" className="chart"></iframe>
          <iframe src={srcList.logEvents} width="750" height="230" className="chart"></iframe>
        </div>
      </div>
      <div className="content-04">
        <span>I/O OverView</span>
        <div className="content-wrapper">
          <iframe src={srcList.rate} width="750" height="200" className="chart"></iframe>
          <iframe src={srcList.errors} width="750" height="200" className="chart"></iframe>
        </div>
      </div>
    </div>
  );
}

export default IframeContainer;
