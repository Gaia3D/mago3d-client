import { Coordinate, isNumber } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

const defaultDm = {
  lon1: "",
  lon2: "",
  lat1: "",
  lat2: "",
}
export const Dm = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("DM");
  const [dm, setDm] = useState({
    ...defaultDm
  })
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    const {lon1, lon2, lat1, lat2} = dm;
    if(isNumber(lon1) && isNumber(lon2) && isNumber(lat1) && isNumber(lat2)){
      const coordinate = Coordinate.fromDM([Number(lon1), Number(lon2)], [Number(lat1), Number(lat2)]);
      setCoordinate(coordinate);
    } else {
      setCoordinate(null);
    }
  }, [dm]);

  useEffect(() => {
    console.info(coordinate);
  }, [coordinate]);

  return (
    <>
    <div className="cordinate-value dm marginTop-10">
      <input type="text" value={dm.lon1} placeholder="127" onChange={(e)=>{setDm({...dm, ...{lon1:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
      <input type="text" value={dm.lon2} placeholder="15.945" onChange={(e)=>{setDm({...dm, ...{lon2:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>＇</span>
      <input type="text" value={dm.lat1} placeholder="36" onChange={(e)=>{setDm({...dm, ...{lat1:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
      <input type="text" value={dm.lat2} placeholder="30.133" onChange={(e)=>{setDm({...dm, ...{lat2:e.target.value}})}}/><span style={{color:'white', fontSize:'12px'}}>＇</span>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setDm({...defaultDm});
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}