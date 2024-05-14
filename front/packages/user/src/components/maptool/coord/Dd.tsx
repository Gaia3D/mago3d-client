import { Coordinate, isNumber } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

export const Dd = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("DD");
  const [lon1, setLon1] = useState<string>("");
  const [lat1, setLat1] = useState<string>("");
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    if(isNumber(lon1) && isNumber(lat1) ){
      const coordinate = new Coordinate(Number(lon1), Number(lat1));
      setCoordinate(coordinate);
    } else {
      setCoordinate(null);
    }
  }, [lon1, lat1]);

  return (
    <>
    <div className="cordinate-value dd marginTop-10">
      <input type="text" value={lon1} placeholder="127.265753" onChange={(e)=>{setLon1(e.target.value)}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
      <input type="text" value={lat1} placeholder="36.502210" onChange={(e)=>{setLat1(e.target.value)}}/><span style={{color:'white', fontSize:'12px'}}>˚</span>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setLon1("");
          setLat1("");
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}