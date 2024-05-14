import { Coordinate, isNumber } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

const defaultDms = {
  lon1: "",
  lon2: "",
  lon3: "",
  lat1: "",
  lat2: "",
  lat3: ""
}
export const Dms = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("DMS");
  const [dms, setDms] = useState({
    ...defaultDms
  })
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    const {lon1, lon2, lon3, lat1, lat2, lat3} = dms;
    if(isNumber(lon1) && isNumber(lon2) && isNumber(lon3) && isNumber(lat1) && isNumber(lat2) && isNumber(lat3)){
      const coordinate = Coordinate.fromDMS([Number(lon1), Number(lon2), Number(lon3)], [Number(lat1), Number(lat2), Number(lat3)]);
      setCoordinate(coordinate);
    } else {
      setCoordinate(null);
    }
  }, [dms]);

  useEffect(() => {
    console.info(coordinate);
  }, [coordinate]);

  return (
    <>
    <div className="cordinate-value dms marginTop-10">
      <input type="text" value={dms.lon1} placeholder="127" onChange={(e)=>{setDms({...dms, ...{lon1:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
      <input type="text" value={dms.lon2} placeholder="15" onChange={(e)=>{setDms({...dms, ...{lon2:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>＇</span>
      <input type="text" value={dms.lon3} placeholder="56.71" onChange={(e)=>{setDms({...dms, ...{lon3:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>″</span>
      <input type="text" value={dms.lat1} placeholder="36" onChange={(e)=>{setDms({...dms, ...{lat1:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
      <input type="text" value={dms.lat2} placeholder="30" onChange={(e)=>{setDms({...dms, ...{lat2:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>＇</span>
      <input type="text" value={dms.lat3} placeholder="7.96" onChange={(e)=>{setDms({...dms, ...{lat3:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>″</span>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setDms({...defaultDms});
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}