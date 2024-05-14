import { colorsYlorrd, getClassBreaks, getClassIndex } from "@/api/util";
import { RasterProfileResult, rasterProfileResultsState } from "@/recoils/Analysis";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceDot  } from 'recharts';
import { useRecoilState } from "recoil";

const RasterProfileChart = () => {
    const [rasterProfileResults, setRasterProfileResults] = useRecoilState<RasterProfileResult[]>(rasterProfileResultsState);
    if (rasterProfileResults.length === 0) return null;
    const values = rasterProfileResults.map((rasterProfileResult) => rasterProfileResult.value);
    const classBreaks = getClassBreaks(values, colorsYlorrd.length);
    
    const CustomizedDot = (props:any) => {
        const {value, cx, cy} = props;
        const index = getClassIndex(value, classBreaks);
        return (
            <circle r="3" stroke="#8884d8" strokeWidth="1" fill={colorsYlorrd[index-1]} width="930" height="260" cx={cx} cy={cy} className="recharts-dot recharts-line-dot"></circle>
        )
    }

    const close = () => {
      setRasterProfileResults([]);
    }

    return (
        <div className="graph-wrapper">
            <div className="dialog-title">
                <h3>래스터 단면도 분석결과</h3>
                <button className="close floatRight" onClick={close}></button>
            </div>
            <div style={{width:'100%', height:'300px', bottom:'0px',position: 'absolute'}}>
                <LineChart data={rasterProfileResults} width={1000} height={300}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={<CustomizedDot/>} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props)=>{
                        return [`${value}`, '래스터 단면도 분석'];
                    }}/>
                </LineChart>
            </div>
            
        </div>
    )
}

export default RasterProfileChart;