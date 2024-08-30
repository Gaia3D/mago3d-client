export type UrlListType = {
  upTime: string;
  startTime: string;
  jvmTotal: string;
  cpuUsage: string;
  logEvents: string;
  rate: string;
  errors: string;
};

export type OptionsType = {
  key: string;
  name: string;
  url: UrlListType;
};

export type DashboardType =
  | "bbs"
  | "dataset"
  | "layerset"
  | "search"
  | "timeseries"
  | "userset";
